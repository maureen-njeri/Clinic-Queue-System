import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import Patient from '@/models/Patient'
import User from '@/models/User'
import bcrypt from 'bcrypt'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
        role: {
          label: 'Role',
          type: 'text',
          placeholder: 'doctor / nurse / pharmacist / patient',
        },
      },
      async authorize(credentials) {
        await dbConnect()

        const { email, password, role } = credentials ?? {}
        console.log('🟡 Received credentials:', { email, password, role })

        if (!email || !password || !role) {
          console.log('❌ Missing credentials')
          throw new Error('Email, password, and role are required')
        }

        let account = null

        if (role.toLowerCase() === 'patient') {
          account = await Patient.findOne({ email }).lean()
          console.log('👤 Found patient:', account)
          if (!account) throw new Error('No patient found with this email')
          const isValid = await bcrypt.compare(password, account.password)
          console.log('🔐 Patient password valid:', isValid)
          if (!isValid) throw new Error('Invalid password')
          account.role = 'patient'
        } else {
          const user = await User.findOne({ email })
          console.log('👤 Found user:', user)
          if (!user) throw new Error('No user found with this email')
          const isValid = await bcrypt.compare(password, user.password)
          console.log('🔐 User password valid:', isValid)
          if (!isValid) throw new Error('Invalid password')
          account = {
            _id: user._id,
            fullName: user.fullName || 'Admin User',
            email: user.email,
            role: user.role,
          }
        }

        console.log('⚖️ Role check:', {
          inputRole: role.toLowerCase(),
          accountRole: account.role.toLowerCase(),
        })

        if (account.role.toLowerCase() !== role.toLowerCase()) {
          console.log('❌ Role mismatch')
          throw new Error(
            `Selected role (${role}) does not match your account role (${account.role})`
          )
        }

        console.log('✅ Authorized user:', account)

        return {
          id: account._id.toString(),
          name: account.fullName,
          email: account.email,
          role: account.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
