// generateHash.ts
import bcrypt from 'bcryptjs'

// Assuming you have these functions in a file, adjust the path as needed
// For simplicity, let's put them directly here for this script
function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function main() {
  const passwordToHash = 'admin123'
  try {
    const newHashedPassword = await hashPassword(passwordToHash)
    console.log(`Original password: "${passwordToHash}"`)
    console.log(`New Hashed Password: "${newHashedPassword}"`)
  } catch (error) {
    console.error('Error hashing password:', error)
  }
}

main()
