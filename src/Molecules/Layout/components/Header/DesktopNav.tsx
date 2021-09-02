import { Box, Stack, HStack, Link, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { DesktopSubNav } from './DesktopSubNav'
import { NAV_ITEMS } from '../navItems'

export const DesktopNav = () => (
  <HStack spacing={4}>
    {NAV_ITEMS.map(navItem => (
      <Box key={navItem.label}>
        <Popover trigger='hover' placement='bottom-start'>
          <PopoverTrigger>
            <Link
              p={2}
              href={navItem.href ?? '#'}
              fontSize='md'
              fontWeight='bold'
              color='gray.200'
              _hover={{ textDecoration: 'none' }}
            >
              {navItem.label}
              {navItem.children && <ChevronDownIcon ml={2} w={5} h={5} />}
            </Link>
          </PopoverTrigger>

          {navItem.children && (
            <PopoverContent
              border={0}
              boxShadow='xl'
              bg='white'
              p={4}
              rounded='sm'
              minW='xs'
              w='100px'
            >
              <Stack>
                {navItem.children.map(child => (
                  <DesktopSubNav key={child.label} {...child} />
                ))}
              </Stack>
            </PopoverContent>
          )}
        </Popover>
      </Box>
    ))}
  </HStack>
)
