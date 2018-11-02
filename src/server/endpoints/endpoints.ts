import * as express from "express";
import { login, logout } from "./authentication";
import { registerPost } from "./endpoint-helper";
import { Endpoints } from "../../common/api/authentication";

export function setupEndpoints(app: express.Application) {
    registerPost(app, Endpoints.login, login);
    registerPost(app, Endpoints.logout, logout);
}
