/**
 * @name merge
 * Merge strings values with space between each entries "string1 string2"
 * @param pClasses
 */
export function merge(pClasses: any[]): string {
  if (pClasses?.length > 0) {
    return pClasses
      ?.reduce((a, b) => a.concat(b), [])
      .filter((v) => v)
      .join(" ");
  }
}
