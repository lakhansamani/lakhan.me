import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'f005683f575047c1a2ae42d465c7a9e2',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Lakhan Samani',
  domain: 'lakhan.me',
  author: 'Lakhan Samani',

  // open graph metadata (optional)
  description: `Lakhan Samani | Building things on the internet. Teaching tech in depth. Building business, courses, products, and communities. Articles and courses to help you launch, grow, and monetize your online business`,

  // social usernames (optional)
  twitter: 'lakhansamani',
  github: 'lakhansamani',
  linkedin: 'lakhansamani',
  // newsletter: '#', // optional newsletter URL
  youtube: 'channel/UCHcTbmbphKFVebvxC8zs3PQ', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: '7d8705ddc01446e09dbc2aacf88ba58a'
    },
    {
      title: 'Contact',
      pageId: '7f80c2a135fb4f51b686f0e6c0c34510'
    }
  ]
})
