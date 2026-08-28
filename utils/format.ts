export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatAge = (dateOfBirth: Date | string) => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const formatCurrency = (amount: number | { toNumber: () => number } | null | undefined) => {
  const value = amount ? (typeof amount === "number" ? amount : amount.toNumber()) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IQD",
  }).format(value);
};

export const formatGender = (gender: string) => {
  return gender === "MALE" ? "Male" : "Female";
};

export const formatStatus = (status: string) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};
