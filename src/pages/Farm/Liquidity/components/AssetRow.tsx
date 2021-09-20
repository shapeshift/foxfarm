import {
  Image,
  Text,
  FormControl,
  FormControlProps,
  Box,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  ButtonProps,
  InputProps
} from '@chakra-ui/react'
import { useState } from 'react'

export type AssetRowProps = {
  src: string
  symbol: string
  balance: string | null
  buttonProps?: ButtonProps
  inputProps?: InputProps
} & FormControlProps

export const AssetRow = ({
  src,
  symbol,
  balance,
  buttonProps,
  inputProps,
  ...rest
}: AssetRowProps) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <FormControl
      borderRadius='lg'
      bg='gray.50'
      borderWidth='1px'
      borderColor={isFocused ? 'blue.500' : 'gray.200'}
      _hover={{ borderColor: isFocused ? 'blue.400' : 'gray.200' }}
      boxShadow={isFocused ? '0 0 0 5px rgba(55,114,249,0.1)' : 'none'}
      transition='all .2s ease-in-out'
      {...rest}
    >
      <Box display='flex' justifyContent='space-between' px={4} py={2}>
        <Text fontSize='sm' height='20px' color='gray.500'>
          Balance: {balance}
        </Text>
        <Button
          variant='ghost'
          fontSize='sm'
          height='20px'
          colorScheme='blue'
          p={0}
          borderRadius='4px'
          {...buttonProps}
        >
          MAX
        </Button>
      </Box>
      <InputGroup>
        <InputLeftAddon
          p={0}
          bg='gray.50'
          minWidth='8rem'
          borderTopLeftRadius='lg'
          borderBottomLeftRadius='lg'
          height='auto'
          borderWidth={0}
          pl={4}
          outline='none'
        >
          <Image boxSize='35px' src={src} />
          <Text ml={2} fontWeight='bold'>
            {symbol}
          </Text>
        </InputLeftAddon>
        <Box h='4rem' pos='relative' flex={1} textAlign='right'>
          <Input
            height='100%'
            bg='gray.50'
            borderRadius='lg'
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            textAlign='right'
            position='relative'
            zIndex={0}
            borderWidth={0}
            borderColor='blackAlpha.100'
            placeholder='Enter Amount'
            _active={{ borderWidth: 0, boxShadow: 'none', outline: 'none' }}
            _focus={{ borderWidth: 0, boxShadow: 'none', outline: 'none' }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...inputProps}
          />
        </Box>
      </InputGroup>
    </FormControl>
  )
}
