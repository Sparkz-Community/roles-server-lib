const { resolve } = require('path')

module.exports = {
  base: '/',
  title: 'IY Foundation Roles Library',
  description: 'IY Foundation Roles Library',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Services', link: '/services/' },
      { text: 'Github', link: 'https://github.com/Sparkz-Community/roles-server-lib' },
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: true,
        children: [
          'introduction/Overview',
          'introduction/guide'
        ]
      },
      {
        title: 'Services',
        collapsable: true,
        children: [
          'services/Roles',
          'services/Abilities',
          'services/Rules'
        ]
      },
      {
        title: 'Hooks',
        collapsable: true,
        children: [
          'hooks/Authorize'
        ]
      },
      {
        title: 'Utils',
        collapsable: true,
        children: [
          'utils/collectRules'
        ]
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@sparkz-community/roles-server-lib': resolve(__dirname, '../../lib')
      }
    }
  }
}
