export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const getDaysInMonth = (year: number, month: number): number => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month];
};

export const getDaysInYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

export const getMonthName = (month: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
};

export const getDayOfWeek = (year: number, month: number, day: number): number => {
  return new Date(year, month, day).getDay();
};

export const formatDateKey = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getWeekDays = (): string[] => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
};
