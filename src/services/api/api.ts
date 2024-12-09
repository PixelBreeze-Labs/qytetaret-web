// services/api/api.ts
const BASE_URL = 'https://v1.api.qytetaret.al';
// const BASE_URL = 'http://127.0.0.1:3000';


interface ApiError {
    message: string;
    statusCode: number;
}

export const makeApiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        // Don't add Content-Type for FormData
        const headers = options.body instanceof FormData
            ? { ...options.headers }
            : {
                'Content-Type': 'application/json',
                ...options.headers,
            };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData: ApiError = await response.json();
            throw errorData; // Throw the entire error object
        }

        return response.json();
    } catch (error) {
        console.error('API error:', error);
        throw error; // Throw the original error for proper handling
    }
};