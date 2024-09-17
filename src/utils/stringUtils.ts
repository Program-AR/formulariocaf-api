// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type
export const literalStrings = <T extends string[]>(...strs: T) => strs