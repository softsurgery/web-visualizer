import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const groups = await req.json()
    
    // Delete all existing groups
    await payload.delete({
      collection: 'groups',
      where: { id: { exists: true } }
    })

    // Create new groups
    for (const group of groups) {
      await payload.create({
        collection: 'groups',
        data: {
          name: group.name,
          layout: group.layout || 'md',
          urls: group.urls || [],
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
