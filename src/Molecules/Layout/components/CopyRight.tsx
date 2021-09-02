import { Center, Text, Link } from '@chakra-ui/react'
import { NAV_PADDING } from './Header/Header'

export const CopyRight = () => {
  const date = new Date()
  const year = date.getFullYear()
  return (
    <Center px={NAV_PADDING} py={8} flexDirection='column'>
      <Text fontSize='.6em' fontWeight='bold' color='gray.500' mb={2}>
        © {year} ShapeShift. All Rights Reserved &nbsp; | &nbsp;
        <Link href='https://shapeshift.com/sitemap.xml'>Sitemap</Link>
      </Text>
      <Text fontSize='.6em' fontWeight='bold' color='gray.500' textAlign='center'>
        Trezor and the Trezor logo are registered trademarks of SatoshiLabs s.r.o. in the United
        States and/or other countries. Ledger and the Ledger logo are registered trademarks of
        Ledger SAS societe par actions simplifiee in the United States and/or other countries.
        ShapeShift is not associated or affiliated with SatoshiLabs s.r.o. or Ledger SAS societe par
        actions simplifiee, and expressly disclaims any and all rights to any such marks.
      </Text>
    </Center>
  )
}
