export default function formatLocaleDate(date: string | Date | number): string {
  try {
    const dateObject = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObject.getTime())) {
      throw new Error("Invalid date");
    }

    return dateObject.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}
