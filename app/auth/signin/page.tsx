'use client'

import { signIn } from 'next-auth/react'

export default function SignInPage() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h1>Sign In</h1>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      <button onClick={() => signIn('credentials')}>Sign in with Email</button>
    </div>
  )
}
