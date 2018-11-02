import { LoginRequest, LoginResponse, ErrorResponse, Endpoints, LogoutRequest } from "../../common/api/authentication";
import { post } from "./api-helper";

export async function login(username: string, password: string) {
    return post<LoginRequest, LoginResponse>(Endpoints.login, { username, password });
}

export async function logout(token: string) {
    return post<LogoutRequest, ErrorResponse>(Endpoints.logout, { token });
}
