import ReactConfetti from 'react-confetti'
import { Button, Link, Text, useTheme } from '@chakra-ui/react'
import { AirdropFoxIcon } from 'Atoms/Icons/AirdropFoxIcon'
import { ClaimInfo } from '../ClaimInfo'
import { State } from 'state/ClaimProvider'
import { bn, fromBaseUnit } from 'utils/math'
import { useHistory } from 'react-router-dom'

type SuccessProps = {
  foxPrice: string | null
  usdValue: string | null
  apr: string | null
  closeDrawer: () => void
  state: State
}

export const Success = ({ foxPrice, usdValue, apr, state, closeDrawer }: SuccessProps) => {
  const theme = useTheme()
  const history = useHistory()
  return (
    <>
      <ReactConfetti
        recycle={false}
        tweenDuration={8000}
        numberOfPieces={1000}
        colors={[
          theme.colors.Gauge[10],
          theme.colors.Gauge[20],
          theme.colors.Gauge[30],
          theme.colors.Gauge[40],
          theme.colors.Gauge[50],
          theme.colors.Gauge[60],
          theme.colors.Gauge[70],
          theme.colors.Gauge[80],
          theme.colors.Gauge[90]
        ]}
      />
      <AirdropFoxIcon size='82px' mb={8} />
      <Text
        fontSize='lg'
        fontWeight='semibold'
        textTransform='uppercase'
        t='airdrop.foxTokenAirdrop'
      />
      <Text fontSize='4xl' mb={12}>
        {`${fromBaseUnit(bn(state.amount as string), 18)} FOX Claimed`}
      </Text>
      <ClaimInfo
        address={state.claimantAddress as string}
        foxPrice={foxPrice as string}
        usdValue={usdValue}
        txHash={state.claimTxHash}
      />
      <Button textTransform='none' w='full' mb={4} onClick={() => history.push('/fox-farming')}>
        Earn up to {apr}% APR on your FOX
      </Button>
      <Link
        href='https://shapeshift.com/fox/benefits'
        textTransform='capitalize'
        w='full'
        size='md'
        v='outline'
        mb={4}
        textAlign='center'
      >
        View FOX benefits
      </Link>
      <Button onClick={closeDrawer} variant='ghost' w='full'>
        Close
      </Button>
    </>
  )
}
