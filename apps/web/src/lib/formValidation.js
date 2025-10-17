// Client-side form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateSubject = (subject) => {
  return subject.trim().length >= 5 && subject.trim().length <= 200;
};

export const validateMessage = (message) => {
  return message.trim().length >= 10 && message.trim().length <= 2000;
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const containsProfanity = (text) => {
  // Basic profanity check - in production, use a proper library
  const profanityList = ["spam", "scam", "fake"];
  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
};

export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.fullName || !validateName(formData.fullName)) {
    errors.fullName = "Name must be between 2 and 100 characters";
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.subject || !validateSubject(formData.subject)) {
    errors.subject = "Subject must be between 5 and 200 characters";
  }

  if (!formData.message || !validateMessage(formData.message)) {
    errors.message = "Message must be between 10 and 2000 characters";
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (
    containsProfanity(formData.message) ||
    containsProfanity(formData.subject)
  ) {
    errors.profanity = "Please use appropriate language";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 2000); // Max length
};
