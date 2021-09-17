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
    unstyled: (props: Record<string, any>) => ({
      tr: {
        role: 'group'
      },
      td: {
        paddingLeft: 4,
        paddingRight: 4
      },
      th: {
        paddingLeft: 4,
        paddingRight: 4
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
