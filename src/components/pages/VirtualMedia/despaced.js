export const despaced = (str) =>
  !str
    ? ""
    : str
        .replace(/\./g, "")
        .replace(/\s/g, "")
        .replace(/_/g, "")
        .replace(/\-/g, "")
        .toLowerCase();
