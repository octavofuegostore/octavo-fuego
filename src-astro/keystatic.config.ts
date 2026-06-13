import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        slug: fields.slug({ label: 'Slug', generation: 'title' }),
        excerpt: fields.text({ label: 'Excerpt', validation: { isRequired: true } }),
        content: fields.markdown({ label: 'Content', validation: { isRequired: true } }),
        publishedAt: fields.datetime({ label: 'Published At', defaultValue: () => new Date().toISOString() }),
        author: fields.text({ label: 'Author', defaultValue: 'Octavo Fuego' }),
        coverImage: fields.image({ label: 'Cover Image', directory: 'public/images/blog', publicPath: '/images/blog/' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Ancestral', value: 'ancestral' },
            { label: 'Cultura', value: 'cultura' },
            { label: 'Salud', value: 'salud' },
          ],
          defaultValue: 'ancestral',
        }),
        featured: fields.boolean({ label: 'Featured', defaultValue: false }),
      },
    }),
  },
});
