export interface NavItem {
  label: string
  children?: Array<NavItem>
  href?: string
}

export const platform = {
  label: 'ShapeShift Platform',
  href: 'https://beta.shapeshift.com'
}
export const coinCap = {
  label: 'CoinCap',
  href: 'https://coincap.io/'
}
export const keepKey = {
  label: 'KeepKey',
  href: 'https://shapeshift.com/keepkey'
}
export const portis = {
  label: 'Portis',
  href: 'https://www.portis.io/'
}
export const helpDesk = {
  label: 'Help Center',
  href: 'https://shapeshift.zendesk.com/hc/en-us'
}
export const foxToken = {
  label: 'FOX Tokens',
  href: 'https://beta.shapeshift.com/fox-token'
}
export const releaseNotes = {
  label: 'Release Notes',
  href: 'https://shapeshift.com/release-notes'
}
export const brandAssets = {
  label: 'Brand Assets',
  href: 'https://shapeshift.com/brand-assets'
}
export const developerPortal = {
  label: 'Developer Portal',
  href: 'https://shapeshift.com/developer-portal'
}

export const FOOTER_ITEMS: Array<NavItem> = [
  {
    label: 'Products',
    children: [platform, keepKey, coinCap, portis]
  },
  {
    label: 'Help',
    children: [
      {
        ...helpDesk,
        label: 'HelpDesk'
      },
      {
        label: 'Terms of Service',
        href: 'https://shapeshift.com/terms-of-service'
      },
      {
        label: 'FAQ',
        href: 'https://shapeshift.com/faq'
      },
      {
        label: 'Privacy Policy',
        href: 'https://shapeshift.com/privacy'
      },
      {
        label: 'Responsible Disclosure Policy',
        href: 'https://shapeshift.com/responsible-disclosure-program'
      }
    ]
  },
  {
    label: 'Resources',
    children: [
      foxToken,
      {
        label: 'Blog',
        href: 'https://medium.com/shapeshift-stories'
      },
      releaseNotes,
      brandAssets,
      developerPortal,
      {
        label: 'Press',
        href: 'https://shapeshift.com/press-releases'
      }
    ]
  }
]

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'About',
    children: [
      releaseNotes,
      {
        label: 'Newsroom ',
        href: 'https://shapeshift.com/newsroom'
      }
    ]
  },
  {
    label: 'Learn',
    children: [
      {
        label: 'Blog',
        href: 'https://shapeshift.com/library'
      },
      {
        label: 'Research',
        href: 'https://shapeshift.com/research'
      },
      {
        label: 'Bitcoin',
        href: 'https://shapeshift.com/category/bitcoin'
      },
      {
        label: 'Crypto 101',
        href: 'https://shapeshift.com/category/crypto-101'
      },
      {
        label: 'Crypto Pro',
        href: 'https://shapeshift.com/category/crypto-pro'
      },
      {
        label: 'Ethereum',
        href: 'https://shapeshift.com/category/ethereum'
      }
    ]
  },
  {
    label: 'Products',
    children: [platform, foxToken, coinCap, keepKey]
  },
  {
    label: 'Resources',
    children: [developerPortal, brandAssets, helpDesk]
  },
  {
    label: 'Buy Crypto',
    href: 'https://shapeshift.com/buy-crypto-with-debit'
  }
]
