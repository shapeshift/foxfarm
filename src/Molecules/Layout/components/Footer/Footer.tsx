import { ReactElement } from 'react'
import {
  Box,
  Container,
  Link,
  Grid,
  Stack,
  Text,
  VisuallyHidden,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { NAV_PADDING } from '../Header/Header'
import { ShapeShiftWordAndLogoMark } from './ShapeShiftWordAndLogoMark'
import { FacebookIcon } from 'Atoms/Icons/FacebookIcon'
import { TwitterIcon } from 'Atoms/Icons/TwitterIcon'
import { InstagramIcon } from 'Atoms/Icons/InstagramIcon'
import { YouTubeIcon } from 'Atoms/Icons/YouTubeIcon'
import { MediumIcon } from 'Atoms/Icons/MediumIcon'
import { DiscordIcon } from 'Atoms/Icons/DiscordIcon'
import { TelegramIcon } from 'Atoms/Icons/TelegramIcon'
import { FOOTER_ITEMS } from '../navItems'

const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactElement
  label: string
  href: string
}) => {
  return (
    <Link
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Link>
  )
}

export const Footer = () => {
  const iconProps = {
    w: '18px',
    h: 'auto',
    fill: 'gray.400',
    transition: 'fill 0.3s ease',
    _hover: { fill: 'gray.300' }
  }
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      pt='100px'
      px={NAV_PADDING}
      boxShadow='0px 0px 15px 4px rgb(0 0 0 / 10%)'
    >
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
        <Stack
          spacing={6}
          alignItems={{ base: 'center', md: 'flex-start' }}
          py={{ base: 4, md: 0 }}
        >
          <ShapeShiftWordAndLogoMark w='200px' h='auto' />
          <HStack spacing={4}>
            <SocialButton label='facebook' href='https://www.facebook.com/ShapeShiftPlatform'>
              <FacebookIcon {...iconProps} />
            </SocialButton>
            <SocialButton label='twitter' href='https://twitter.com/ShapeShift_io'>
              <TwitterIcon {...iconProps} />
            </SocialButton>
            <SocialButton label='instagram' href='https://www.instagram.com/shapeshift_io'>
              <InstagramIcon {...iconProps} />
            </SocialButton>
            <SocialButton
              label='youtube'
              href='https://www.youtube.com/channel/UCu3maYVeb18l2b1gqjO5KeQ'
            >
              <YouTubeIcon {...iconProps} />
            </SocialButton>
            <SocialButton label='medium' href='https://medium.com/shapeshift-stories'>
              <MediumIcon {...iconProps} />
            </SocialButton>
            <SocialButton label='discord' href='https://discord.com/invite/dVVkMhb'>
              <DiscordIcon {...iconProps} />
            </SocialButton>
            <SocialButton label='telegram' href='https://t.me/shapeshiftofficial'>
              <TelegramIcon {...iconProps} />
            </SocialButton>
          </HStack>
        </Stack>
        {FOOTER_ITEMS.map(({ label, children }) => (
          <Stack key={label} align={{ base: 'center', md: 'flex-start' }} py={{ base: 4, md: 0 }}>
            <Text fontWeight='bold' fontSize='lg' color='gray.600' textTransform='uppercase'>
              {label}
            </Text>
            <Box h='3px' w='35px' pt={2} pb={6}>
              <Box h='3px' w='35px' bg='primary' />
            </Box>
            {children?.map(child => (
              <Link
                key={child.label}
                href={child.href}
                pb={4}
                fontSize='lg'
                fontWeight='bold'
                color='gray.500'
                _hover={{ color: 'gray.800', transform: 'translateX(10px)' }}
              >
                {child.label}
              </Link>
            ))}
          </Stack>
        ))}
      </Grid>
      <Container as={Stack} w='100%' py={10}></Container>
    </Box>
  )
}
