export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const getRegisterErrors = ({ name, email, phone, password, role }) => {
  const errors = {};
  if (!name?.trim()) errors.name = "Name is required.";
  if (!email?.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Email format is invalid.";
  if (!phone?.trim()) errors.phone = "Phone is required.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (!role) errors.role = "Please select account type.";
  return errors;
};

export const getLoginErrors = ({ email, password }) => {
  const errors = {};
  if (!email?.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Email format is invalid.";
  if (!password) errors.password = "Password is required.";
  return errors;
};
