import { HStack, Link } from '@chakra-ui/react'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { theme } from 'lib/theme/theme'

const StyleNavLink = styled(NavLink)`
  padding-top: 22px;
  padding-bottom: 20px;
  border-bottom: 4px solid transparent;

  &:hover {
    text-decoration: none !important;
  }

  &.active {
    color: ${theme.colors.white};
    border-bottom: 4px solid ${theme.colors.blue[500]};
  }
`

const tabNav = [
  {
    label: 'Benefits',
    href: 'https://shapeshift.com/fox/benefits'
  },
  {
    label: 'Airdrop',
    href: '/airdrop'
  },
  {
    label: 'FOX Farming',
    href: '/fox-farming'
  },
  {
    label: 'Governance',
    href: 'https://shapeshift.com/fox/governance'
  },
  {
    label: 'Resources',
    href: 'https://shapeshift.com/fox/resources'
  }
]

const TabNavItem = ({ label, href }: { label: string; href: string }) => {
  const sharedProps = useMemo(() => {
    return {
      color: 'gray.400',
      fontWeight: 'bold',
      textDecoration: 'none',
      fontSize: { base: 'sm', md: 'md' },
      children: label
    }
  }, [label])

  if (href.startsWith('http')) {
    return <Link {...sharedProps} href={href} whiteSpace='nowrap' />
  }

  return (
    <Link
      {...sharedProps}
      as={StyleNavLink}
      activeClassName='active'
      to={href}
      whiteSpace='nowrap'
    />
  )
}

export const navOffset = '70px'

export const TabNav = () => (
  <HStack
    spacing={{ base: 8, md: 12 }}
    h={navOffset}
    overflowX='scroll'
    overflowY='hidden'
    width={{ base: '100%', md: 'auto' }}
    px={6}
  >
    {tabNav.map(item => (
      <TabNavItem key={item.label} {...item} />
    ))}
  </HStack>
)
