import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return {
        users: {
          in: [user.id],
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      return {
        users: {
          in: [user.id],
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return {
        users: {
          in: [user.id],
        },
      }
    },
  },
  fields: [
    {
      name: 'uuid',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Unique UUID for public sharing and identification.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => value || uuidv4(),
        ],
      },
    },
    {
      name: 'users',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      admin: {
        description: 'Users who have access to this group.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small Grid', value: 'sm' },
        { label: 'Medium Grid', value: 'md' },
        { label: 'Large Grid', value: 'lg' },
        { label: 'List View', value: 'list' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'urls',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'pointToCenter',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
