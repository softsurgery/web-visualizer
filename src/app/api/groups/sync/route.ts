import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groups = await req.json()
    
    // Delete all existing groups for this user
    await payload.delete({
      collection: 'groups',
      where: { users: { in: [user.id] } }
    })

    // Create new groups
    for (const group of groups) {
      await payload.create({
        collection: 'groups',
        data: {
          name: group.name,
          layout: group.layout || 'md',
          urls: group.urls || [],
          users: [user.id as any],
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
