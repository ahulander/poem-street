import { LoginRequest, LoginResponse, ErrorResponse, Endpoints, LogoutRequest } from "../../common/api/authentication";
import { post } from "./api-utility";

export async function login(username: string, password: string) {
    return post<LoginRequest, LoginResponse>(Endpoints.login, { username, password });
}

export async function logout() {
    return post<LogoutRequest, ErrorResponse>(Endpoints.logout);
}
