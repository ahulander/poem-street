import { LoginRequest, LoginResponse, ErrorResponse } from "../../common/api/authentication";
import * as crypto from "crypto";
import { setUserSession } from "../user-sessions";

export async function login(request: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    
    const users = {
        "alexander": true,
        "filip": true
    };

    if (!users[request.username]) {
        return {
            error: 401,
            message: "Unauthorized"
        };
    }

    const token = crypto.randomBytes(24).toString("hex");
    setUserSession(request.username, token);

    return {
        token: token
    };
}
