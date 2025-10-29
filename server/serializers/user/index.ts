export const serializeUserResponse = (user: any): any => {
  const { password: _, ...rest } = user;
  return rest;
};
