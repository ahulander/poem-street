import { LoginRequest, LoginResponse, ErrorResponse, LogoutRequest } from "../../common/api/authentication";
import * as crypto from "crypto";
import { setUserSession, kickUserSession, getUserSession } from "../user-sessions";



const users: {[username: string]: {saltedpassword: string, salt: string}} = {}

function sha256(password: string, salt: string) {
    return crypto.createHash("sha256").update(password).update(salt).digest("base64");
}

export async function login(request: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    
    if (!request || !request.username || !request.password) {
        return {
            statusCode: 400,
            message: "Bad request"
        };
    }

    if (!users[request.username]) {
        const salt = crypto.randomBytes(64).toString("hex");
        const saltedpassword = sha256(request.password, salt);
        users[request.username] = {
            salt: salt,
            saltedpassword: saltedpassword
        };
    }
    else if(users[request.username].saltedpassword !== sha256(request.password, users[request.username].salt)) {
        return {
            statusCode: 401,
            message: "Unauthorized."
        };
    }

    const token = crypto.randomBytes(24).toString("hex");
    setUserSession(request.username, token);

    return {
        token: token
    };
}

export async function logout(request: LogoutRequest): Promise<ErrorResponse> {

    if (!request || !request.token) {
        return {
            statusCode: 400,
            message: "Bad request"
        };
    }

    const session = getUserSession(request.token);
    if (session) {
        kickUserSession(request.token);
    }
    
    return {
        statusCode: 200,
        message: "OK"
    };
}
