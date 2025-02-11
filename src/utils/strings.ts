export const combineClassNames = (
  ...classes: (string | boolean | undefined)[]
) => {
  return classes.filter(Boolean).join(" ");
};
