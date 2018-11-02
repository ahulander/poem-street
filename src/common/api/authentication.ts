
export interface ErrorResponse {
    statusCode: number;
    message: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LogoutRequest {
    token: string;
}

export interface LoginResponse {
    token: string;
}

export enum Endpoints {
    login = "/login",
    logout = "/logout"
}
