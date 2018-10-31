import { LoginRequest, LoginResponse, ErrorResponse } from "../../common/api/authentication";

export async function login(request: LoginRequest): Promise<LoginResponse | ErrorResponse> {

    const users = {
        "alexander": "alexander_token",
        "filip": "filip_token"
    };

    const token = users[request.username];
    
    if (token === undefined) {
        return {
            error: 401,
            message: "Unauthorized"
        };
    }

    return {
        token: token
    };
}
