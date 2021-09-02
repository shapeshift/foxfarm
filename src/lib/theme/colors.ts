const commonColors = {
  blue: {
    50: '#e9effe',
    100: '#EBEFFE',
    200: '#b5cbfc',
    300: '#96b4fb',
    400: '#6f98fa',
    500: '#3872f9',
    600: '#3266e0',
    700: '#2c59c4',
    800: '#244aa1',
    900: 'rgba(56,111,249, 0.1)'
  },
  bluegray: {
    700: '#7b8ba0',
    600: '#3B4D68',
    500: '#546480',
    400: '#37465e'
  },
  green: {
    500: '#00CD98',
    800: 'rgba(0, 205, 152, 0.2)'
  },
  red: {
    500: '#ef5350',
    300: '#ef5350'
  },
  orange: {
    500: '#cd742e',
    800: '#201915'
  },
  yellow: {
    100: '#49463C',
    200: '#f8c22e',
    500: '#f7b500',
    800: '#cb9500'
  },
  error: '#EF5350',
  warning: '#F7B500',
  success: '#50BB7C',
  blackalpha: {
    5: 'rgba(0,0,0,.05)',
    10: 'rgba(0,0,0,.10)',
    20: 'rgba(0,0,0,.2)',
    30: 'rgba(0,0,0,.3)',
    40: 'rgba(0,0,0,.4)',
    50: 'rgba(0,0,0,.5)',
    75: 'rgba(0,0,0,.75)',
    80: 'rgba(0,0,0,.85)'
  },
  whitealpha: {
    2: 'rgba(255,255,255,.02)',
    3: 'rgba(255,255,255,.03)',
    5: 'rgba(255,255,255,.05)',
    7: 'rgba(255,255,255,.07)',
    8: 'rgba(255,255,255,.08)',
    10: 'rgba(255,255,255,.1)',
    20: 'rgba(255,255,255,.2)',
    30: 'rgba(255,255,255,.3)',
    40: 'rgba(255,255,255,.4)',
    50: 'rgba(255,255,255,.5)',
    75: 'rgba(255,255,255,.75)',
    80: 'rgba(255,255,255,.85)'
  },
  panel: 'rgba(35,45,68, .5)'
}

const brandColors = {
  primary: commonColors.blue[500],
  secondary: commonColors.bluegray[500],
  border: `${commonColors.whitealpha[5]}`,
  borderAccent: `${commonColors.bluegray[500]}40`,
  bg: {
    light: '#111C31',
    normal: '#0a111e',
    dark: '#000',
    alpha: commonColors.blackalpha[20]
  },
  danger: {
    200: '#EF5350',
    300: '#D74a48',
    400: '#BD413F',
    500: '#9C3634'
  },
  button: {
    200: '#3872f9',
    300: '#3266e0',
    400: '#2c59c4',
    500: '#244aa1'
  }
}

export const Gauge = {
  10: '#EF5350',
  20: 'orange',
  30: 'darkorange',
  40: '#00CD98',
  50: '#4f74e3',
  60: '#3F51B5',
  70: '#9C27B0',
  80: '#EC407A',
  90: '#EC407A'
}

export const colors = {
  ...commonColors,
  ...brandColors,
  Gauge
}
