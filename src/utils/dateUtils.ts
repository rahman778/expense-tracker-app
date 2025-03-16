export const getCurrentUnixTimestamp = (): number => {
  const currentDate = new Date();
  return Math.floor(currentDate.getTime() / 1000); // Convert to seconds
};
