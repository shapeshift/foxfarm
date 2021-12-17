import Onboard from 'bnc-onboard'
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'
import { Web3Provider } from '@ethersproject/providers'

const POLLING_INTERVAL = 15000

// this key is connected to a dev github account
// only need it for the 3 months while the airdrop is active
// can be managed here: https://dashboard.fortmatic.com/
// it is the free version.
const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_KEY = process.env.REACT_APP_PORTIS_DAPP_ID
const CONTACT_EMAIL = 'support@shapeshift.com'
const APP_URL = 'https://shapeshift.com'
const RPC_URL = process.env.REACT_APP_RPC_URL
const APP_NAME = 'FOX Token Benefits'

const hasWebUSB = !!navigator.usb

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = POLLING_INTERVAL
  return library
}

const wallets = [
  {
    walletName: 'keepkey',
    preferred: true,
    rpcUrl: RPC_URL,
    label: hasWebUSB ? undefined : 'Supported on Chrome or Brave'
  },
  {
    walletName: 'portis',
    apiKey: PORTIS_KEY,
    preferred: true,
    label: 'Portis By ShapeShift'
  },
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'walletConnect',
    rpc: {
      1: RPC_URL
    },
    bridge: process.env.REACT_APP_WALLETCONNECT_BRIDGE,
    preferred: true
  },
  {
    walletName: 'trezor',
    appUrl: APP_URL,
    email: CONTACT_EMAIL,
    rpcUrl: RPC_URL,
    preferred: true
  },
  {
    walletName: 'ledger',
    rpcUrl: RPC_URL,
    preferred: true
  },
  { walletName: 'coinbase', preferred: true },
  { walletName: 'trust', preferred: true, rpcUrl: RPC_URL },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'torus', preferred: true },
  { walletName: 'status' },
  { walletName: 'trust' },
  { walletName: 'walletLink', rpcUrl: RPC_URL, appName: APP_NAME, preferred: true },
  { walletName: 'imToken', rpcUrl: RPC_URL },
  { walletName: 'meetone' },
  { walletName: 'mykey', rpcUrl: RPC_URL },
  { walletName: 'huobiwallet', rpcUrl: RPC_URL },
  { walletName: 'hyperpay' },
  { walletName: 'wallet.io', rpcUrl: RPC_URL },
  { walletName: 'atoken' },
  { walletName: 'frame' },
  { walletName: 'ownbit' },
  { walletName: 'alphawallet' },
  { walletName: 'gnosis' },
  { walletName: 'xdefi' },
  { walletName: 'bitpie' }
]

const walletCheck = [
  { checkName: 'derivationPath' },
  { checkName: 'accounts' },
  { checkName: 'connect' },
  { checkName: 'network' }
]

export function initOnboard(subscriptions: Subscriptions) {
  return Onboard({
    networkId: 1,
    blockPollingInterval: POLLING_INTERVAL,
    hideBranding: true,
    walletSelect: {
      wallets: wallets,
      agreement: {
        version: '1.0',
        termsUrl: 'https://shapeshift.com/terms-of-service',
        privacyUrl: 'https://shapeshift.com/privacy'
      }
    },
    walletCheck,
    subscriptions
  })
}
