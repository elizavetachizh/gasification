export const showOrdersCount = (
  selectedStatus: string,
  status: string,
  length: number,
) => {
  return selectedStatus === status ? `(${length})` : "";
};
