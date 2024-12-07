// services/api/api.ts
const BASE_URL = 'https://v1.api.qytetaret.al';
// const BASE_URL = 'http://127.0.0.1:3000';

interface ApiError {
    message: string;
    statusCode: number;
}

// Helper function to handle API requests
export const makeApiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // Handle non-2xx responses as errors
        if (!response.ok) {
            const errorData: ApiError = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const responseData: T = await response.json();
        return responseData;
    } catch (error) {
        // Handle network or JSON parsing errors
        console.error('API error:', error);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
};
