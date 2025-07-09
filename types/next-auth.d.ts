import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
      fullName?: string | null
    }
  }

  interface User {
    role?: string | null
    fullName?: string | null
  }
}
