import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Salon from '../models/Salon.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateTimeSlots,
  getDayName,
  minutesToTime,
  rangesOverlap,
  timeToMinutes,
} from '../utils/timeSlots.js';

const ACTIVE_STATUSES = ['pending', 'confirmed'];

export const computeEndTime = (startTime, durationMinutes) => {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
};

export const validateBooking = async ({
  salonId,
  serviceId,
  staffId,
  date,
  startTime,
  excludeAppointmentId,
}) => {
  const salon = await Salon.findById(salonId);
  if (!salon || salon.status !== 'approved') {
    throw new ApiError(404, 'Salon not available for booking');
  }

  const service = await Service.findOne({ _id: serviceId, salonId, status: 'active' });
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  const staff = await Staff.findOne({ _id: staffId, salonId, status: { $ne: 'inactive' } });
  if (!staff) {
    throw new ApiError(404, 'Staff member not found');
  }

  if (!staff.services.some((id) => id.toString() === serviceId.toString())) {
    throw new ApiError(400, 'This staff member does not offer the selected service');
  }

  const day = getDayName(date);
  const salonHours = salon.openingHours?.[day];
  if (!salonHours || salonHours.closed) {
    throw new ApiError(400, 'Salon is closed on the selected date');
  }

  const staffDay = staff.availability?.[day];
  if (!staffDay?.available) {
    throw new ApiError(400, 'Staff member is not available on the selected date');
  }

  const endTime = computeEndTime(startTime, service.duration);

  if (
    timeToMinutes(startTime) < timeToMinutes(salonHours.open) ||
    timeToMinutes(endTime) > timeToMinutes(salonHours.close)
  ) {
    throw new ApiError(400, 'Selected time is outside salon opening hours');
  }

  if (
    timeToMinutes(startTime) < timeToMinutes(staffDay.start) ||
    timeToMinutes(endTime) > timeToMinutes(staffDay.end)
  ) {
    throw new ApiError(400, 'Selected time is outside staff availability');
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const conflicts = await Appointment.find({
    staffId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ACTIVE_STATUSES },
    ...(excludeAppointmentId ? { _id: { $ne: excludeAppointmentId } } : {}),
  });

  const hasConflict = conflicts.some((appt) =>
    rangesOverlap(startTime, appt.endTime, appt.startTime, appt.endTime)
  );

  if (hasConflict) {
    throw new ApiError(409, 'This time slot is no longer available');
  }

  return { salon, service, staff, endTime };
};

export const getAvailableSlots = async ({ salonId, serviceId, staffId, date }) => {
  const salon = await Salon.findById(salonId);
  if (!salon || salon.status !== 'approved') return [];

  const service = await Service.findOne({ _id: serviceId, salonId, status: 'active' });
  if (!service) return [];

  const staff = await Staff.findOne({ _id: staffId, salonId, status: { $ne: 'inactive' } });
  if (!staff) return [];

  if (!staff.services.some((id) => id.toString() === serviceId.toString())) return [];

  const day = getDayName(date);
  const salonHours = salon.openingHours?.[day];
  const staffDay = staff.availability?.[day];

  if (!salonHours || salonHours.closed || !staffDay?.available) return [];

  const open = minutesToTime(
    Math.max(timeToMinutes(salonHours.open), timeToMinutes(staffDay.start))
  );
  const close = minutesToTime(
    Math.min(timeToMinutes(salonHours.close), timeToMinutes(staffDay.end))
  );

  const allSlots = generateTimeSlots(open, close, service.duration);

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const booked = await Appointment.find({
    staffId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ACTIVE_STATUSES },
  });

  return allSlots.filter((slot) => {
    const endTime = computeEndTime(slot, service.duration);
    return !booked.some((appt) => rangesOverlap(slot, endTime, appt.startTime, appt.endTime));
  });
};
