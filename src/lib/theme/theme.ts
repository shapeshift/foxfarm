import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import { ButtonStyle as Button } from './button'
import { colors } from './colors'

export const breakpoints = createBreakpoints({
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px'
})

export const theme = extendTheme({
  breakpoints,
  fonts: {
    body: 'Open Sans, sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },
  fontWeights: {
    body: 300,
    heading: 400,
    bold: 600
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors,
  components: {
    Button
  },
  shadows: {
    xl: '0 2px 4px 2px rgba(0,0,0,.15),0 2px 10px 2px rgba(0,0,0,.2)'
  }
})
