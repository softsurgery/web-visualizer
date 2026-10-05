import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groups = await req.json()
    if (!Array.isArray(groups)) {
      return NextResponse.json({ error: 'Invalid payload: expected an array of groups' }, { status: 400 })
    }

    // Fetch all existing groups for this user
    const existing = await payload.find({
      collection: 'groups',
      where: {
        users: {
          in: [user.id],
        },
      },
      limit: 1000,
      overrideAccess: true,
    })

    const existingDocs = existing.docs || []
    const retainedIds = new Set<number | string>()
    const savedGroups: any[] = []

    let orderIndex = 0
    for (const group of groups) {
      // Find existing match by UUID first, then ID, then by name if not yet retained
      const match =
        (group.uuid && existingDocs.find((d: any) => d.uuid === group.uuid)) ||
        existingDocs.find((d) => String(d.id) === String(group.id)) ||
        existingDocs.find((d) => !retainedIds.has(d.id) && d.name === group.name)

      if (match) {
        retainedIds.add(match.id)
        const updated = await payload.update({
          collection: 'groups',
          id: match.id,
          data: {
            name: group.name,
            layout: group.layout || 'md',
            urls: group.urls || [],
            uuid: group.uuid || (match as any).uuid || uuidv4(),
            isPublic: Boolean(group.isPublic),
            // @ts-ignore
            order: orderIndex++,
          },
          overrideAccess: true,
        })
        savedGroups.push({
          id: String(updated.id),
          uuid: (updated as any).uuid,
          name: updated.name,
          layout: updated.layout,
          isPublic: Boolean((updated as any).isPublic),
          urls: updated.urls || [],
        })
      } else {
        const created = await payload.create({
          collection: 'groups',
          data: {
            name: group.name,
            layout: group.layout || 'md',
            urls: group.urls || [],
            users: [user.id as any],
            uuid: group.uuid || uuidv4(),
            isPublic: Boolean(group.isPublic),
            // @ts-ignore
            order: orderIndex++,
          },
          overrideAccess: true,
        })
        retainedIds.add(created.id)
        savedGroups.push({
          id: String(created.id),
          uuid: (created as any).uuid,
          name: created.name,
          layout: created.layout,
          isPublic: Boolean((created as any).isPublic),
          urls: created.urls || [],
        })
      }
    }

    // Delete any existing groups for this user that are not in the retained set (including duplicate records)
    for (const doc of existingDocs) {
      if (!retainedIds.has(doc.id)) {
        await payload.delete({
          collection: 'groups',
          id: doc.id,
          overrideAccess: true,
        })
      }
    }

    return NextResponse.json({ success: true, groups: savedGroups })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
