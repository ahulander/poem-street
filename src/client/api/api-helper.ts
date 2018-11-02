
export async function post<TRequest, TResponse>(url: string, data?: TRequest): Promise<TResponse> {
    
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
