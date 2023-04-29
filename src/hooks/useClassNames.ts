/*
  Hook to build and memoize className string in BEM structure.

  Will build one 'block-element' and then add any amount of modifiers.
*/

interface ModifierArg {
  type: string
  condition: boolean
}

const useClassNames =
  (block: string, styleSheet: any) =>
  (elements?: Array<string>, modifiers?: Array<ModifierArg>): string => {
    if (!elements && !modifiers) return styleSheet[block]

    let classNameAcc = block

    if (elements) {
      classNameAcc += `${elements.map((e) => `__${e}`).join('')}`
    }

    if (modifiers) {
      const classNames: Array<string> = [classNameAcc]

      for (const modifier of modifiers) {
        if (modifier.type && modifier.condition) {
          classNames.push(`${classNameAcc}--${modifier.type}`)
        }
      }

      return classNames.map((c) => styleSheet[c]).join(' ')
    } else {
      return styleSheet[classNameAcc]
    }
  }

export default useClassNames
