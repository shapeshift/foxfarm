import { Flex, Text, Stack, Link, useDisclosure, Button, Box, Center } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { NAV_ITEMS, NavItem } from '../navItems'
import { NAV_PADDING } from './Header'
import { HeaderCtas } from './HeaderCtas'

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <Box onClick={children && onToggle} mb={4}>
        <Flex
          py={2}
          as={Link}
          href={href}
          justify='space-between'
          align='center'
          _hover={{ textDecoration: 'none' }}
        >
          <Text fontWeight={600} color='white'>
            {label}
          </Text>
          {children && <ChevronRightIcon w={6} h={6} color='white' />}
        </Flex>
      </Box>
      <Box
        position='absolute'
        top={0}
        left={0}
        bg='bg.light'
        w='100%'
        h='100vh'
        zIndex={1}
        p={NAV_PADDING}
        transition={'all .4s ease-in-out'}
        opacity={isOpen ? '100%' : '0%'}
        transform={`translateX(${isOpen ? '0px' : '100vw'})`}
      >
        <Stack pl={4} align='start'>
          <Button variant='link' onClick={onToggle} ml={-6}>
            <ChevronLeftIcon w={6} h={6} color='white' />
            Back
          </Button>
          {children &&
            children.map(child => (
              <Link key={child.label} color='white' pt={4} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Box>
    </>
  )
}

export const MobileNav = () => (
  <Stack p={NAV_PADDING} display={{ md: 'none' }} position='relative'>
    {NAV_ITEMS.map(navItem => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
    <Center pt={8}>
      <HeaderCtas />
    </Center>
  </Stack>
)
