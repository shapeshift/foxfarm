import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Flex
} from '@chakra-ui/react'
import { Confirm } from './Confirm'
import { Benefits } from './Benefits'
import { Status } from './Status'
import BgImage from 'assets/img/midnight.jpg'
import { FC, useCallback, useEffect, useState } from 'react'
import { ClaimActions, useClaim } from 'state/ClaimProvider'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { bn, formatBaseAmount, toBaseUnit } from 'utils/math'

export enum DrawerSteps {
  CONFIRM,
  BENEFITS,
  STATUS
}

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ClaimDrawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const [drawerStep, setDrawerStep] = useState<DrawerSteps>(DrawerSteps.CONFIRM)
  const { state, dispatch } = useClaim()
  const foxPrice = useCoinCapPrice('fox-token')
  const formattedFoxPrice = formatBaseAmount(toBaseUnit(foxPrice as string, 18), 18)
  const airdropUsd = formatBaseAmount(bn(state.amount as string).times(bn(foxPrice as string)), 18)

  const DrawerStep = useCallback(() => {
    if (drawerStep === DrawerSteps.STATUS) {
      return <Status closeDrawer={onClose} foxPrice={formattedFoxPrice} usdValue={airdropUsd} />
    }
    if (drawerStep === DrawerSteps.BENEFITS) {
      return <Benefits setStep={setDrawerStep} />
    }
    return (
      <Confirm
        setStep={setDrawerStep}
        closeDrawer={onClose}
        foxPrice={formattedFoxPrice}
        usdValue={airdropUsd}
      />
    )
  }, [drawerStep, onClose, formattedFoxPrice, airdropUsd])

  // always reset back to first step
  useEffect(() => {
    if (!isOpen) {
      setDrawerStep(DrawerSteps.CONFIRM)
      dispatch({ type: ClaimActions.RESET_STATE })
    }
  }, [isOpen, dispatch])

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={() => (drawerStep !== DrawerSteps.BENEFITS ? onClose() : null)}
      size='md'
    >
      <DrawerOverlay zIndex={1} />
      <DrawerContent
        bg='bg.light'
        backgroundImage={`url(${BgImage})`}
        backgroundSize='auto 100%'
        backgroundRepeat='no-repeat'
        backgroundPosition='center'
        h='full'
        zIndex={1}
        className='ss-drawer'
      >
        {drawerStep !== DrawerSteps.BENEFITS && <DrawerCloseButton color='white' mb={0} />}

        <DrawerBody pb={0}>
          <Flex
            align='center'
            direction='column'
            justify='center'
            h='100%'
            w='100%'
            m='0 auto'
            color='white'
          >
            <DrawerStep />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
