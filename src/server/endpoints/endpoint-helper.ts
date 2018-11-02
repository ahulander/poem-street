import * as express from "express";
import { ErrorResponse } from "../../common/api/authentication";

export function badRequest() {
    return errorResponse(400, "Bad Request");
}

export function errorResponse(statusCode: number, message: string): ErrorResponse {
    return { statusCode, message };
}

export function registerPost(
    app: express.Application,
    url: string,
    callback: (request: any) => Promise<any>
) {
    app.post(url, async (request, response) => {
        response.append("Content-Type", "application/json");
        try {
            let result = await callback(request.body);
            result = result ? result : errorResponse(200, "OK");

            if (result.error !== undefined) {
                response.status(result.error);
            }
            response.json(result);
            response.end();
        } catch(error) {
            console.error(error);
            response.status(500);
            response.json(errorResponse(500, "Internal server error"));
            response.end();
        }
    });
}