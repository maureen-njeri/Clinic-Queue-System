// app/api/test-mongo/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb' // or '@/lib/mongoose' if that's the filename

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db() // This uses the DB from your URI
    const collections = await db.listCollections().toArray()

    return NextResponse.json({ collections })
  } catch (error: any) {
    console.error('[MongoDB Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
