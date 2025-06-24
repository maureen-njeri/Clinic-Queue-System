import { verifyPwd } from './lib/bcrypt'

const hashed = '$2b$10$Q088FbEsdHFS.ILtIQeoL.jnrrPcH3VHKvD8X0XhJdyO4k0lyCt7W'
const plain = 'admin123'

verifyPwd(plain, hashed).then((result) => {
  console.log('Password verification result:', result)
})
