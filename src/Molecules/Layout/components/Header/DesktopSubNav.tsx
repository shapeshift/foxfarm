import { Flex, Text, Stack, Icon, Link } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { NavItem } from '../navItems'

export const DesktopSubNav = ({ label, href }: NavItem) => (
  <Link href={href} role='group' display='block' p={2} rounded='md' color='black'>
    <Stack direction='row' align='center'>
      <Text transition='all .3s ease' _groupHover={{ color: 'primary' }} fontWeight={500}>
        {label}
      </Text>
      <Flex
        transition='all .3s ease'
        transform='translateX(-10px)'
        opacity={0}
        _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
        justify='flex-end'
        align='center'
        flex={1}
      >
        <Icon color='primary' w={5} h={5} as={ChevronRightIcon} />
      </Flex>
    </Stack>
  </Link>
)
