import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import Patient from '@/models/Patient'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        await dbConnect()

        const { email, password, role } = credentials ?? {}
        if (!email || !password || !role) {
          throw new Error('Missing credentials')
        }

        let account = null

        if (role.toLowerCase() === 'patient') {
          account = await Patient.findOne({ email }).lean()
          if (!account) throw new Error('No patient found')
          const isValid = await bcrypt.compare(password, account.password)
          if (!isValid) throw new Error('Wrong password')
          account.role = 'patient'
        } else {
          const user = await User.findOne({ email })
          if (!user) throw new Error('No user found')
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) throw new Error('Wrong password')
          account = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          }
        }

        if (account.role.toLowerCase() !== role.toLowerCase()) {
          throw new Error('Incorrect role selected')
        }

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
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
