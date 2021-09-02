export const ButtonStyle = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: 'primary',
      color: 'white',
      borderRadius: 300,
      paddingLeft: 16,
      paddingRight: 16,
      _disabled: {
        bg: 'button.300',
        _hover: { bg: 'blue.300' },
        opacity: 0.6
      },
      _hover: { _disabled: { bg: 'button.300' } },
      _loading: { _disabled: { bg: 'blue.300' } },
      _active: { bg: 'button.400' }
    },
    ghost: {
      variant: 'ghost',
      colorScheme: 'gray',
      color: 'secondary',
      borderRadius: 300,
      _hover: { bg: 'whitealpha.20', color: 'white' }
    },
    secondary: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'blue.500',
      variant: 'outline',
      borderRadius: 300,
      color: 'blue.500',
      _hover: { bg: 'blackAlpha.200' },
      _active: { bg: 'bg.dark' }
    },
    outline: {
      bg: 'transparent',
      color: 'white',
      border: '1px solid',
      borderColor: 'whitealpha.50',
      borderRadius: 300,
      paddingLeft: 6,
      paddingRight: 6,
      _hover: { bg: 'whitealpha.20', color: 'white' }
    },
    danger: {
      bg: 'danger.200',
      color: 'white',
      textTransform: 'uppercase',
      borderRadius: 300,
      _hover: { bg: 'danger.300' },
      _active: { bg: 'danger.400' }
    },
    success: {
      bg: 'green.500',
      _hover: 'green.800',
      color: 'white',
      borderRadius: 300,
      _disabled: {
        bg: 'green.500',
        opacity: 0.5
      }
    },
    link: {
      color: 'white',
      variant: 'link'
    },
    toggle: {
      bg: 'gray.100',
      color: 'gray.300',
      borderRadius: '8px',
      _hover: {
        bg: 'gray.300',
        color: 'gray.500'
      },
      _active: {
        bg: 'blue.500',
        color: 'white'
      }
    }
  },
  // default values for `size` and `variant`
  defaultProps: {}
}
