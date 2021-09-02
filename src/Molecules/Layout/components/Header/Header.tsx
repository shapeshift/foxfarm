import { useEffect, useState } from 'react'
import { Box, Flex, IconButton, Collapse, useDisclosure, Link } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { HeaderCtas } from './HeaderCtas'
import { breakpoints } from 'lib/theme/theme'
import { useWindowWidth } from '@react-hook/window-size'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { FoxIcon } from 'Atoms/Icons/FoxIcon'
import { WalletButton } from './WalletButton'

const NAV_HEIGHT = '72px'
export const NAV_PADDING = { base: 6, lg: 16 }

export const Header = () => {
  const [showBg, setShowBg] = useState(false)
  const { isOpen, onToggle } = useDisclosure()
  const windowWidth = useWindowWidth()

  useScrollPosition(({ currPos }) => {
    if (currPos.y !== 0) {
      setShowBg(true)
    } else if (currPos.y === 0) {
      setShowBg(false)
    }
  })

  useEffect(() => {
    if (isOpen && windowWidth > Number(breakpoints.md.split('px')[0])) onToggle()
  }, [windowWidth, isOpen, onToggle])

  return (
    <>
      <Flex
        bg={showBg ? 'bg.light' : 'none'}
        color='white'
        minH={NAV_HEIGHT}
        py={2}
        px={NAV_PADDING}
        align='center'
        position='fixed'
        top={0}
        left={0}
        right={0}
        zIndex={1}
        mt={showBg ? 0 : 4}
        transition='all .4s ease'
      >
        <Flex flex={{ base: 1 }} justify='start' alignItems='center'>
          <Link href='https://shapeshift.com'>
            <FoxIcon w={{ base: '30px', lg: '40px' }} h={{ base: '30px', lg: '40px' }} />
          </Link>
          <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <WalletButton mr={6} />
        <HeaderCtas display={{ base: 'none', lg: 'inline-flex' }} />

        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={8} h={8} />}
          aria-label='Toggle Navigation'
          display={{ base: 'flex', lg: 'none' }}
          colorScheme='white'
          _focus={{ outline: 'none' }}
        />
      </Flex>
      <Box position='fixed' top={NAV_HEIGHT} left={0} right={0} bg='bg.light' zIndex={100}>
        <Collapse in={isOpen} animateOpacity>
          <Box h={`calc(100vh - ${NAV_HEIGHT})`}>
            <MobileNav />
          </Box>
        </Collapse>
      </Box>
    </>
  )
}
