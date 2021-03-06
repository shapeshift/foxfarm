import { Flex, Box, HStack, Link } from '@chakra-ui/layout'
import { Button, useColorModeValue, Image, Text, Skeleton } from '@chakra-ui/react'
import { Tr, Td } from '@chakra-ui/table'
import { Tag } from '@chakra-ui/tag'
import { numberFormatter } from 'utils/helpers'
import { bnOrZero } from 'utils/math'
import { AprLabel } from './AprLabel'

type GenericStakingRowProps = {
  apy?: string | null
  tvl?: string | null
  assetImage?: string
  assetImageSecondary?: string
  assetName?: string
  assetDescription?: string
  network?: string
  rewardsImage?: string
  url?: string
  urlLabel?: string
  aprFallbackLabel?: string
}

export const GenericStakingRow = ({
  apy,
  tvl,
  assetImage,
  assetImageSecondary,
  assetName,
  assetDescription,
  rewardsImage,
  network,
  url,
  urlLabel,
  aprFallbackLabel
}: GenericStakingRowProps) => {
  const bg = useColorModeValue('gray.100', 'gray.750')
  const renderApy = (size?: string) => {
    return (
      <>
        {apy === null && aprFallbackLabel ? (
          <Link href={url} isExternal>
            <Tag colorScheme='gray'>{aprFallbackLabel}</Tag>
          </Link>
        ) : apy ? (
          <>
            <AprLabel size={size || 'md'} apr={apy ?? '-'} />
          </>
        ) : (
          <Text>-</Text>
        )}
      </>
    )
  }
  return (
    <Tr _hover={{ bg }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={assetImage}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={0}
              mr={assetImageSecondary ? -3 : undefined}
              borderRadius='full'
            />
            {assetImageSecondary && (
              <Image
                src={assetImageSecondary}
                boxSize={{ base: '30px', lg: '40px' }}
                borderRadius='full'
              />
            )}
          </Flex>
          <Box>
            <Text fontWeight='bold'>{assetName}</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              {assetDescription}
            </Text>
            <Skeleton display={{ base: 'inline-flex', lg: 'none' }} isLoaded={apy !== undefined}>
              {renderApy('sm')}
            </Skeleton>
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Skeleton isLoaded={apy !== undefined}>{renderApy()}</Skeleton>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        <Skeleton isLoaded={tvl !== undefined}>
          {tvl === null ? (
            <Text>-</Text>
          ) : (
            <Text>${numberFormatter(bnOrZero(tvl ?? null).toNumber(), 2)}</Text>
          )}
        </Skeleton>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        <Tag colorScheme='purple' textTransform='capitalize'>
          {network}
        </Tag>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        <HStack>
          {rewardsImage ? <Image src={rewardsImage} boxSize='24px' /> : <Text>-</Text>}
        </HStack>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>-</Td>
      <Td display={{ base: 'block', md: 'table-cell' }}>
        <Button isFullWidth colorScheme='green' as={Link} href={url} isExternal>
          {urlLabel}
        </Button>
      </Td>
    </Tr>
  )
}
