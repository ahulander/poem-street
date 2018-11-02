import * as express from "express";
import { login, logout } from "./endpoints/authentication";
import { ErrorResponse, Endpoints } from "../common/api/authentication";
import { registerPost } from "./endpoints/endpoint-helper";

export function setupEndpoints(app: express.Application) {
    registerPost(app, Endpoints.login, login);
    registerPost(app, Endpoints.logout, logout);
}
