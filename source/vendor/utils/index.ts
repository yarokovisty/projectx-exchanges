/**
 * Calculates a URL with given parameters.
 * 
 * @param baseURL - The base URL to which the path and parameters will be appended.
 * @param path - The path to be appended to the base URL.
 * @param params - An object containing the parameters to be appended to the URL.
 * 
 * @returns A string representing the calculated URL with the base URL, path, and parameters.
 * 
 * @example
 * ```typescript
 * const baseURL = "https://api.example.com";
 * const path = "/v1/ticker";
 * const params = { symbol: "BTC USDT" };
 * const url = CalcURLWithParams(baseURL, path, params);
 * console.log(url); // Output: "https://api.example.com/v1/ticker?symbol=BTC%20USDT"
 * ```
*/
export function CalcURLWithParams(
    baseURL: string,
    path: string,
    params: Record<string, string>
): string {
    const keys = Object.keys(params);
    let url = baseURL + path;

    if (keys.length > 0) {
        url += "?";
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = encodeURIComponent(params[key]);
            url += `${key}=${value}`;

            if (i < keys.length - 1) {
                url += "&";
            }
        }
    }

    return url;
}


/**
 * Transforms a pair of strings into a single string based on given flags.
 * 
 * @example:
 *  flags1 = 0b01 => eth-usdt
 *  flags2 = 0b10 => ETHUSDT
 *  flags3 = 0b11 => ETH-USDT
 *  flags4 = 0b00 => ethusdt
 * 
 * @param pair - The input string pair to be transformed.
 * @param flags - A number representing the transformation flags.
 *  - Bit 0: If set to 0, the result will be in lower case. If set to 1, the result will be in upper case.
 *  - Bit 1: If set to 0, the result will be separated by a space. If set to 1, the result will be separated by a dash.
 *
 * @returns The transformed string based on the input pair and flags.
*/
export const TransformPair = (pair: string, flags: number): string => {
    // Нормализация входных данных: удаление пробелов и дефисов
    const normalizedPair = pair.replace(/[\s-]/g, '').toLowerCase();
    
    // Разделение нормализованной строки на две части
    const part1 = normalizedPair.slice(0, normalizedPair.length / 2);
    const part2 = normalizedPair.slice(normalizedPair.length / 2);

    const useLowerCase = (flags & 0b10) === 0;
    const useDash = (flags & 0b01) !== 0;

    let result = useDash ? `${part1}-${part2}` : `${part1}${part2}`;
    result = useLowerCase ? result.toLowerCase() : result.toUpperCase();

    return result;
}