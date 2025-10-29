
export const findAdminUserByEmailOrPhone = (where: {
  email?: string;
  phone?: string;
}) =>
  // prisma.user.findFirst({
  //   where: {
  //     OR: [
  //       { ...where, role: USER_ROLE.SUPER_ADMIN },
  //       { ...where, role: USER_ROLE.OUTLET_ADMIN }
  //     ]
  //   }
  // });
  undefined // TODO
