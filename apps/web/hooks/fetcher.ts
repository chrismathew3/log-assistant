const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function fetcher<T>(endpoint: string, config?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, config);
    if (!res.ok) {
        throw new Error(`Request failed with ${res.status}`);
    }
    return (await res.json()) as T;
}
