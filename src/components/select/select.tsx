import * as React from 'react'
import ReactSelect, { StylesConfig, Props, OptionProps } from 'react-select'

import theme from './select.module.scss'

const colourStyles: StylesConfig = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: theme['color--primary'],
    borderStyle: 'solid',
    borderColor: isFocused ? theme['color--white'] : theme['color--secondary'],
    borderRadius: '6px',
    borderWidth: '2px',
    boxShadow: 'none',
    color: theme['color--white'],
    fontWeight: 'bold',

    ':hover': {
      borderColor: isFocused
        ? theme['color--white']
        : theme['color--secondary'],
      backgroundColor: theme['color--primary-hover'],
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isFocused || isSelected
        ? theme['color--primary']
        : undefined,
      color: isDisabled
        ? theme['color--disabled']
        : isSelected || isFocused
        ? theme['color--white']
        : theme['color--secondary'],
      cursor: isDisabled ? 'not-allowed' : 'default',
      fontWeight: isFocused || isSelected ? 'bold' : 'normal',
    }
  },
  dropdownIndicator: (styles) => ({
    ...styles,
    color: theme['color--white'],

    ':hover': {
      color: theme['color--white'],
    },
  }),
  input: (styles) => ({ ...styles, color: theme['color--white'] }),
  placeholder: (styles) => ({ ...styles, color: theme['color--white'] }),
  singleValue: (styles) => ({ ...styles, color: theme['color--white'] }),
}

export default function Select(props: Props) {
  return <ReactSelect {...props} styles={colourStyles} />
}
