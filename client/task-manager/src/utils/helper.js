//It checks if the email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regex.test(email);
};