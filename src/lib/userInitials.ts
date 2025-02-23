export const getInitials = (
  name?: string | null,
  maxLength: number = 2
): string => {
  if (!name?.trim()) {
    return "U";
  }

  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "U";
  }

  if (nameParts.length === 1) {
    const singleName = nameParts[0];
    return singleName.charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};
