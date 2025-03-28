import { BASE_URL } from "@/lib/constants"


export const fetcher = async <T>(endpoint: string, config?: RequestInit): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`
    const res = await fetch(url, config)
    if (!res.ok) {
        throw new Error(`Request failed with ${res.status}`)
    }
    return res.json() as Promise<T>
}