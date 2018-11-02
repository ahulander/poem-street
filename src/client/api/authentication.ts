import { LoginRequest, LoginResponse, ErrorResponse } from "../../common/api/authentication";

async function post<TRequest, TResponse>(url: string, data?: TRequest): Promise<TResponse> {
    
    function validResponse(r: any) {
        return r.error === undefined;
    }

    const body = data !== undefined ? JSON.stringify(data) : undefined;
    let result: TResponse = null;
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });
        result = await response.json();
        if (!validResponse(result)) {
            result = null;
        }
    } catch(error) {
        result = null;
    }
    return result;
}

export async function login(username: string, password: string) {
    return post<LoginRequest, LoginResponse>("/login", {
        username: username,
        password: password
    });
}
