import { NavLink as RouterLink, NavLinkProps } from 'react-router-dom'
import { Link, LinkProps } from '@chakra-ui/react'
import React from 'react'

export const NavLink: React.FC<LinkProps & NavLinkProps> = props => (
  <Link as={RouterLink} {...props} />
)
