import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getLibrary, initOnboard } from 'lib/onboard'

const SUPPORTED_NETWORKS = [1]

enum WalletActions {
  SET_ONBOARD = 'SET_ONBOARD',
  SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_WALLET = 'SET_WALLET',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_INITIALIZED = 'SET_INITIALIZED',
  SET_IS_CONNECTED = 'SET_IS_CONNECTED',
  RESET_STATE = 'RESET_STATE'
}

interface InitialState {
  onboard: OnboardAPI | null
  account: string | null
  provider: Web3Provider | null
  blockNumber: number | null
  wallet: Wallet | null
  active: boolean
  isConnected: boolean
  initialized: boolean
}

const initialState: InitialState = {
  onboard: null,
  blockNumber: null,
  account: null,
  provider: null,
  wallet: null,
  active: false,
  isConnected: false,
  initialized: false
}

interface IWalletContext {
  state: InitialState
  dispatch: React.Dispatch<ActionTypes>
  connect: () => Promise<void>
  disconnect: () => void
}

type ActionTypes =
  | { type: WalletActions.SET_ONBOARD; payload: OnboardAPI }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: Wallet }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.RESET_STATE }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_ONBOARD:
      return { ...state, onboard: action.payload }
    case WalletActions.SET_BLOCK_NUMBER:
      return { ...state, blockNumber: action.payload }
    case WalletActions.SET_ACCOUNT:
      return { ...state, account: action.payload }
    case WalletActions.SET_PROVIDER:
      return { ...state, provider: action.payload }
    case WalletActions.SET_WALLET:
      return { ...state, wallet: action.payload }
    case WalletActions.SET_ACTIVE:
      return { ...state, active: action.payload }
    case WalletActions.SET_INITIALIZED:
      return { ...state, initialized: action.payload }
    case WalletActions.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    case WalletActions.RESET_STATE:
      return {
        ...state,
        account: null,
        provider: null,
        wallet: null,
        active: false,
        isConnected: false
      }
    default:
      return state
  }
}

const WalletContext = createContext<IWalletContext | null>(null)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [network, setNetwork] = useState<number | null>(null)
  const connect = useCallback(async () => {
    try {
      const selected = await state.onboard?.walletSelect()
      if (selected) {
        const ready = await state.onboard?.walletCheck()
        if (ready) {
          dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
        } else {
          dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
          window.localStorage.removeItem('selectedWallet')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [state?.onboard])

  const disconnect = useCallback(() => {
    if (state.onboard) {
      state.onboard?.walletReset()
    }
    dispatch({ type: WalletActions.RESET_STATE })
    window.localStorage.removeItem('selectedWallet')
  }, [state?.onboard])

  const connectPrevious = useCallback(
    async (previous: string) => {
      try {
        const selected = await state.onboard?.walletSelect(previous)
        if (!selected) dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        if (selected && state?.onboard?.walletCheck) {
          const ready = await state.onboard.walletCheck()
          if (ready) {
            dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          } else {
            dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
            window.localStorage.removeItem('selectedWallet')
          }
        }
      } catch (error) {
        console.warn(error)
        dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        disconnect()
        window.localStorage.removeItem('selectedWallet')
      }
    },
    [disconnect, state.onboard]
  )

  const setBlockNumber = useCallback(
    (blockNumber: number) => {
      if (state?.provider && blockNumber !== state.blockNumber) {
        dispatch({ type: WalletActions.SET_BLOCK_NUMBER, payload: blockNumber })
      }
    },
    [state.blockNumber, state?.provider]
  )

  useEffect(() => {
    const onboard = initOnboard({
      network: network => {
        setNetwork(network)
      },
      address: address => {
        dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
      },
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          dispatch({ type: WalletActions.SET_WALLET, payload: wallet })
          dispatch({ type: WalletActions.SET_PROVIDER, payload: getLibrary(wallet.provider) })
          window.localStorage.setItem('selectedWallet', wallet.name as string)
        } else {
          disconnect()
        }
      }
    })
    dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we explicitly only want this to happen once

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
    if (previouslySelectedWallet && state.onboard && !state.active) {
      void connectPrevious(previouslySelectedWallet)
    } else if (!previouslySelectedWallet && state.onboard) {
      dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
    }
  }, [state.onboard, disconnect, state.active, connectPrevious])

  useEffect(() => {
    if (state.wallet && state.active && state.account) {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
    } else {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: false })
    }
  }, [state.account, state.active, state.wallet])

  useEffect(() => {
    if (network && state.active && state.wallet && !SUPPORTED_NETWORKS.includes(network)) {
      disconnect()
    }
  }, [network, state.active, state.wallet, disconnect])

  // attach/detach listeners
  useEffect(() => {
    if (state?.provider) {
      state?.provider
        .getBlockNumber()
        .then(setBlockNumber)
        .catch(error => console.error(`Failed to get block number for chainId:`, error))

      state?.provider.on('block', setBlockNumber)
    } else {
      dispatch({ type: WalletActions.SET_BLOCK_NUMBER, payload: null })
    }
    return () => {
      if (state?.provider) {
        state.provider.off('block', setBlockNumber)
      }
    }
  }, [setBlockNumber, state?.provider])

  const store: IWalletContext = useMemo(
    () => ({ state, dispatch, connect, disconnect }),
    [state, connect, disconnect]
  )

  return <WalletContext.Provider value={store}>{children}</WalletContext.Provider>
}

export const useWallet = (): IWalletContext =>
  useContext(WalletContext as React.Context<IWalletContext>)
