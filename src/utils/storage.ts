/** Clears browser storage on logout so sessions and cached auth do not persist. */
export const clearClientStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};
