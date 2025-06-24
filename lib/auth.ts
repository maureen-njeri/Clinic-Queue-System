import bcrypt from 'bcrypt'

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

/**
 * Verifies a plain text password against a hashed password.
 * @param password - The plain text password entered by the user.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword)
  return isValid
}
