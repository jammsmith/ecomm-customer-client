import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: '3px',
    minHeight: '42px',
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4,
    },
    lg: {
      fontSize: 'lg',
      px: 8,
      py: 6,
    },
    xl: {
      fontSize: 'lg',
      px: 12,
      py: 8,
    },
  },
  // Two variants: outline and solid
  variants: {
    primary: {
      bg: 'brand.primary',
      border: 'none',
      color: 'brand.white',
      _hover: {
        background: 'brand.primaryHover',
        _disabled: {
          background: 'brand.primary',
          opacity: 0.5,
        },
      },
      _disabled: {
        background: 'brand.primary',
        opacity: 0.5,
      },
    },
    primaryOutline: {
      bg: 'brand.white',
      borderColor: 'brand.primary',
      borderStyle: 'solid',
      borderRadius: '6px',
      borderWidth: '1px',
      color: 'brand.secondary',
      _hover: {
        background: 'brand.primary',
      },
    },
    primarySelected: {
      bg: 'brand.primary',
      borderColor: 'brand.primary',
      borderStyle: 'solid',
      borderRadius: '6px',
      borderWidth: '1px',
      color: 'brand.secondary',
    },
    secondary: {
      bg: 'brand.white',
      border: 'none',
      color: 'brand.secondary',
      _hover: {
        background: 'brand.whiteHover',
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    variant: 'secondary',
  },
})

export default Button
