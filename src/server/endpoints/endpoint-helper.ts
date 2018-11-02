import * as express from "express";

export function registerPost(
    app: express.Application,
    url: string,
    callback: (request: any) => Promise<any>
) {
    app.post(url, async (request, response) => {
        response.append("Content-Type", "application/json");
        try {
            const result = await callback(request.body);
            if (result !== undefined) {
                if (result.error !== undefined) {
                    response.status(result.error);
                }
                response.json(result);
            }
            response.end();
        } catch(error) {
            console.error(error);
            response.status(500);
            response.json({
                error: 500,
                message: "Internal server error"
            });
            response.end();
        }
    });
}
