export const restoreObjectLabels = (object) => {
  return Object.keys(object).reduce((out, key) => {
    const value = object[key];
    const label = typeof value === "object" ? "M" : "S";
    out[key] = { [label]: value };
    return out;
  }, {});
};
