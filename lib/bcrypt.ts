import bcrypt from 'bcrypt'

/**
 * Hash a plain password
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compare a plain password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from DB
 * @returns Promise<boolean> - True if passwords match
 */
export function verifyPwd(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
