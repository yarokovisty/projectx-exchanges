export function CalcURLWithParams(
    baseURL: string,
    path: string,
    params?: Record<string, string>
): string {
    const keys = params ? Object.keys(params) : []
    let url = baseURL + path

    if (keys.length > 0) {
        url += "?"
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (params) {
                const value = encodeURIComponent(params[key])
                url += `${key}=${value}`
            }

            if (i < keys.length - 1) {
                url += "&"
            }
        }
    }

    return url
}