import { User } from "./models/user.js";

/**
 * Check if a user with email exists.
 */
export async function existsUser(email: string) {
  const user = await User.findOne({ where: { email } });
  return user ? true : false;
}
