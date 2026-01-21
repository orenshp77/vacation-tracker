// Format date to DD.MM.YYYY
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Format date for input field (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

// Format price with currency
export const formatPrice = (price) => {
    return `$${Number(price).toLocaleString()}`;
};

// Get image URL
export const getImageUrl = (imageName) => {
    if (!imageName) return '/placeholder.jpg';
    return `http://localhost:4000/uploads/${imageName}`;
};

// Check if date is in the past
export const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
};

// Check if vacation is active (started but not ended)
export const isVacationActive = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
};

// Check if vacation hasn't started yet
export const isVacationFuture = (startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    return start > today;
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
