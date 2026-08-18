import Service from '../models/Service.js';
import Salon from '../models/Salon.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

const getOwnerSalon = async (ownerId) => {
  const salon = await Salon.findOne({ ownerId });
  if (!salon) throw new ApiError(404, 'Salon not found');
  return salon;
};

export const getServices = catchAsync(async (req, res) => {
  const filter = { status: 'active' };
  if (req.query.salonId) filter.salonId = req.query.salonId;
  if (req.query.category) filter.category = req.query.category;

  const services = await Service.find(filter).populate('salonId', 'name location rating').limit(100);
  res.json({ success: true, data: { services } });
});

export const getServiceById = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('salonId');
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: { service } });
});

export const createService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const service = await Service.create({ ...req.body, salonId: salon._id });
  res.status(201).json({ success: true, data: { service } });
});

export const updateService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const service = await Service.findOne({ _id: req.params.id, salonId: salon._id });
  if (!service) throw new ApiError(404, 'Service not found');

  Object.assign(service, req.body);
  await service.save();
  res.json({ success: true, data: { service } });
});

export const deleteService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const service = await Service.findOneAndDelete({ _id: req.params.id, salonId: salon._id });
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, message: 'Service deleted' });
});

export const getSalonServices = catchAsync(async (req, res) => {
  const services = await Service.find({ salonId: req.params.salonId });
  res.json({ success: true, data: { services } });
});

export const adminToggleService = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  service.status = service.status === 'active' ? 'inactive' : 'active';
  await service.save();
  res.json({ success: true, data: { service } });
});

export const getAllServicesAdmin = catchAsync(async (req, res) => {
  const services = await Service.find().populate('salonId', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: { services } });
});
