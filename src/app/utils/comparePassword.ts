import * as bcrypt from "bcrypt";

export const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  try {
    const match: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};
