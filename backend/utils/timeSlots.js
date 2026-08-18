const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const getDayName = (date) => DAYS[new Date(date).getDay()];

export const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const rangesOverlap = (startA, endA, startB, endB) => {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);
  return a1 < b2 && b1 < a2;
};

export const generateTimeSlots = (open, close, duration, interval = 30) => {
  const slots = [];
  let current = timeToMinutes(open);
  const end = timeToMinutes(close);

  while (current + duration <= end) {
    slots.push(minutesToTime(current));
    current += interval;
  }

  return slots;
};

export default { getDayName, timeToMinutes, minutesToTime, rangesOverlap, generateTimeSlots };
