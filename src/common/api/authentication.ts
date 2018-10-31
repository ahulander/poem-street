
export interface ErrorResponse {
    error: number;
    message: string;
}

export interface LoginRequest {
    username: string;
}

export interface LoginResponse {
    token: string;
}

