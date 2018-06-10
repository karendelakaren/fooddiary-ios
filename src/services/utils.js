export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const monthAbbrs = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

export const getMonthAbbr = (inputDate) => {
    const date = new Date(inputDate);
    return monthAbbrs[date.getMonth()];
};

export const getDay = (inputDate) => {
    const date = new Date(inputDate);
    return date.getDate();
};