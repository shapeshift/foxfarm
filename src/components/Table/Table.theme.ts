import { mode } from '@chakra-ui/theme-tools'
export const TableStyle = {
  parts: ['tr', 'th', 'td'],
  // Styles for the base style
  baseStyle: {
    th: {
      textTransform: 'none',
      letterSpacing: 'normal',
      fontSize: 'md',
      color: 'gray.500',
      paddingInlineStart: 2,
      paddingInlineEnd: 2
    }
  },
  // Styles for the size variations
  sizes: {
    md: {
      td: {
        paddingLeft: 4,
        paddingRight: 4
      }
    }
  },
  // Styles for the visual style variations
  variants: {
    simple: (props: Record<string, any>) => ({
      tr: {
        ':hover': {
          td: {
            bg: mode('white.100', 'gray.750')(props)
          }
        }
      },
      td: {
        paddingLeft: 4,
        paddingRight: 4,
        border: 0,
        ':first-child': {
          borderTopLeftRadius: 'lg',
          borderBottomLeftRadius: 'lg'
        },
        ':last-child': {
          borderTopRightRadius: 'lg',
          borderBottomRightRadius: 'lg'
        }
      },
      th: {
        paddingLeft: 4,
        paddingRight: 4,
        border: 0
      }
    }),
    'no-gutter': {
      td: {
        ':first-child': {
          paddingLeft: 0
        },
        ':last-child': {
          paddingRight: 0
        }
      },
      th: {
        fontSize: 'sm',
        fontWeight: '500',
        ':first-child': {
          paddingLeft: 0
        },
        ':last-child': {
          paddingRight: 0
        }
      }
    }
  },
  // The default `size` or `variant` values
  defaultProps: {}
}
