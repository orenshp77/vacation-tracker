export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 4;
};

export const isValidPrice = (price: number): boolean => {
    return price >= 0 && price <= 10000;
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
};

export const isFutureDate = (date: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    return checkDate >= today;
};

export const sanitizeString = (str: string): string => {
    return str.trim();
};
