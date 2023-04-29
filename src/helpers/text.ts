export const capitalise = (str: string | undefined) => {
  if (!str || !str.length) return ''

  const words = str.split(' ')

  return words
    .map((word) => {
      const [first, ...rest] = word.split('')

      return `${first.toUpperCase()}${rest.join('')}`
    })
    .join(' ')
}
