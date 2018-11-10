import { LoginRequest, LoginResponse, ErrorResponse, LogoutRequest } from "../../common/api/authentication";

import UserSession from "../user/user-sessions";
import Users from "../user/users";
import { errorResponse, badRequest } from "./endpoint-helper";

export async function login(request: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    
    if (!request || !request.username || !request.password) {
        return badRequest();
    }

    let user = Users.getByName(request.username);
    if (!user) {
        user = Users.createUser(request.username, request.password);
    }
    else if (!Users.checkPassword(user, request.password)) {
        return errorResponse(401, "Unauthorized");
    }

    const token = Users.generateToken();
    UserSession.create(user.id, user.name, token);
    user.logins += 1;

    console.log(`${user.name}: ${user.logins}`);

    return { token };
}

export async function logout(request: LogoutRequest): Promise<ErrorResponse> {

    if (!request || !request.token) {
        return badRequest();
    }

    const session = UserSession.getByToken(request.token);
    if (session) {
        UserSession.kick(request.token);
    }
}
