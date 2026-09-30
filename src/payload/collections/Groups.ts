import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
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
