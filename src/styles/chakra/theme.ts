import { extendTheme } from '@chakra-ui/react'
import { Button } from './components'

const colors = {
  brand: {
    primary: '#8DD9BF', // teal
    primaryHover: '#7CBAA4',
    secondary: '#28211E', // dark brown
    secondaryHover: '#394039',
    white: '#fff',
    whiteHover: '#f3f2ef',
    disabled: '#c6c6c6',
    error: '#DC143C',
    success: '#54c69f',
  },
  input: {
    borderColor: '#b09d95',
  },
}

const styles = {
  global: {
    'html, body': {
      color: 'brand.secondary',
    },
  },
}

const theme = extendTheme({
  colors,
  styles,
  components: {
    Button,
  },
})

export default theme
