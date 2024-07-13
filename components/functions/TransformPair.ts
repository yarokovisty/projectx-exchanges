export const TransformPair = (pair: string, flags: number): string => {
    const normalizedPair = pair.replace(/[\s\/-]/g, '').toLowerCase()
    
    const part1 = normalizedPair.slice(0, normalizedPair.length / 2)
    const part2 = normalizedPair.slice(normalizedPair.length / 2)

    const useLowerCase = (flags & 0b10) === 0
    const useDash = (flags & 0b01) !== 0

    let result = useDash ? `${part1}-${part2}` : `${part1}${part2}`
    result = useLowerCase ? result.toLowerCase() : result.toUpperCase()

    return result
}