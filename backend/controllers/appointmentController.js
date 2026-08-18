import Appointment from '../models/Appointment.js';
import Staff from '../models/Staff.js';
import Salon from '../models/Salon.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { validateBooking, getAvailableSlots } from '../services/appointmentService.js';
import { createNotification } from '../services/notificationService.js';

const populateFields = [
  { path: 'customerId', select: 'name email phone' },
  { path: 'salonId', select: 'name location phone' },
  { path: 'staffId', select: 'name specialization' },
  { path: 'serviceId', select: 'name duration price' },
];

export const createAppointment = catchAsync(async (req, res) => {
  const { salonId, serviceId, staffId, date, startTime, notes } = req.body;

  const { service, endTime } = await validateBooking({
    salonId,
    serviceId,
    staffId,
    date,
    startTime,
  });

  const appointment = await Appointment.create({
    customerId: req.user._id,
    salonId,
    staffId,
    serviceId,
    date,
    startTime,
    endTime,
    price: service.price,
    notes: notes || '',
    status: 'pending',
  });

  const populated = await Appointment.findById(appointment._id).populate(populateFields);
  const salon = await Salon.findById(salonId);

  await createNotification({
    userId: salon.ownerId,
    type: 'appointment',
    title: 'New booking request',
    message: `${req.user.name} booked ${service.name}`,
    metadata: { appointmentId: appointment._id },
  });

  res.status(201).json({ success: true, data: { appointment: populated } });
});

export const getAvailability = catchAsync(async (req, res) => {
  const { salonId, serviceId, staffId, date } = req.query;
  if (!salonId || !serviceId || !staffId || !date) {
    throw new ApiError(400, 'salonId, serviceId, staffId, and date are required');
  }

  const slots = await getAvailableSlots({
    salonId,
    serviceId,
    staffId,
    date: new Date(date),
  });

  res.json({ success: true, data: { slots } });
});

export const getMyAppointments = catchAsync(async (req, res) => {
  const filter = { customerId: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.upcoming === 'true') {
    filter.date = { $gte: new Date() };
    filter.status = { $in: ['pending', 'confirmed'] };
  }

  const appointments = await Appointment.find(filter)
    .populate(populateFields)
    .sort({ date: 1, startTime: 1 });

  res.json({ success: true, data: { appointments } });
});

export const getSalonAppointments = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) throw new ApiError(404, 'Salon not found');

  const filter = { salonId: salon._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) {
    const d = new Date(req.query.date);
    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end };
  }

  const appointments = await Appointment.find(filter)
    .populate(populateFields)
    .sort({ date: 1, startTime: 1 });

  res.json({ success: true, data: { appointments } });
});

export const getStaffAppointments = catchAsync(async (req, res) => {
  const staff = await Staff.findOne({ userId: req.user._id });
  if (!staff) throw new ApiError(404, 'Staff profile not found');

  const filter = { staffId: staff._id };
  if (req.query.upcoming === 'true') {
    filter.date = { $gte: new Date() };
    filter.status = { $in: ['pending', 'confirmed'] };
  }

  const appointments = await Appointment.find(filter)
    .populate(populateFields)
    .sort({ date: 1, startTime: 1 });

  res.json({ success: true, data: { appointments } });
});

export const getAllAppointments = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const appointments = await Appointment.find(filter)
    .populate(populateFields)
    .sort({ date: -1 })
    .limit(200);

  res.json({ success: true, data: { appointments } });
});

export const updateAppointmentStatus = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('salonId');
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  const { status } = req.body;
  const role = req.user.role;

  if (role === 'customer') {
    if (appointment.customerId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not your appointment');
    }
    if (!['cancelled'].includes(status)) {
      throw new ApiError(403, 'Customers can only cancel appointments');
    }
  } else if (role === 'owner') {
    const salon = await Salon.findOne({ ownerId: req.user._id });
    if (!salon || appointment.salonId._id.toString() !== salon._id.toString()) {
      throw new ApiError(403, 'Not your salon appointment');
    }
  } else if (role === 'staff') {
    const staff = await Staff.findOne({ userId: req.user._id });
    if (!staff || appointment.staffId.toString() !== staff._id.toString()) {
      throw new ApiError(403, 'Not your assigned appointment');
    }
    if (!['completed', 'no-show'].includes(status)) {
      throw new ApiError(403, 'Staff can only mark completed or no-show');
    }
  }

  appointment.status = status;
  await appointment.save();

  await createNotification({
    userId: appointment.customerId,
    type: 'appointment',
    title: 'Appointment updated',
    message: `Your appointment is now ${status}`,
    metadata: { appointmentId: appointment._id },
  });

  const populated = await Appointment.findById(appointment._id).populate(populateFields);
  res.json({ success: true, data: { appointment: populated } });
});

export const rescheduleAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  if (appointment.customerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not your appointment');
  }

  const { date, startTime } = req.body;
  const { service, endTime } = await validateBooking({
    salonId: appointment.salonId,
    serviceId: appointment.serviceId,
    staffId: appointment.staffId,
    date,
    startTime,
    excludeAppointmentId: appointment._id,
  });

  appointment.date = date;
  appointment.startTime = startTime;
  appointment.endTime = endTime;
  appointment.price = service.price;
  appointment.status = 'pending';
  await appointment.save();

  const populated = await Appointment.findById(appointment._id).populate(populateFields);
  res.json({ success: true, data: { appointment: populated } });
});

export const getAppointmentById = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(populateFields);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  res.json({ success: true, data: { appointment } });
});
