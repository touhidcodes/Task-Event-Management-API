import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "./prisma";
import config from "../config/config";

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin is live now!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.superAdmin.super_admin_username as string,
      12
    );

    const superAdminData = {
      email: config.superAdmin.super_admin_email as string,
      password: hashedPassword,
      role: UserRole.ADMIN,
      username: config.superAdmin.super_admin_username as string,
    };

    if (!isExistSuperAdmin) {
      const superAdmin = await prisma.$transaction(
        async (transactionClient) => {
          const createdUserData = await transactionClient.user.create({
            data: superAdminData,
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          const userId = createdUserData.id;

          await transactionClient.userProfile.create({
            data: {
              userId: userId,
            },
          });
        }
      );
      return superAdmin;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};
