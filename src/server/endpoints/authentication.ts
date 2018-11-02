import { LoginRequest, LoginResponse, ErrorResponse } from "../../common/api/authentication";
import * as crypto from "crypto";
import { setUserSession } from "../user-sessions";



const users: {[username: string]: {saltedpassword: string, salt: string}} = {}

function sha256(password: string, salt: string) {
    return crypto.createHash("sha256").update(password).update(salt).digest("base64");
}

export async function login(request: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    
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
            error: 401,
            message: "Unauthorized."
        };
    }

    const token = crypto.randomBytes(24).toString("hex");
    setUserSession(request.username, token);

    return {
        token: token
    };
}
