import * as crypto from "crypto";

export interface User {
    id: number;
    name: string;
    saltedPassword: string;
    salt: string;

    logins: number;
}

let _nextUserId = 0;
const _users: {[name: string]: User} = {};

function sha256(password: string, salt: string) {
    return crypto.createHash("sha256").update(password).update(salt).digest("base64");
}

function getByName(name: string) {
    const result = _users[name];
    return result;
}

function checkPassword(user: User, password: string) {
    return user.saltedPassword === sha256(password, user.salt);
}

function createUser(name: string, password: string) {
    const salt = crypto.randomBytes(64).toString("hex");
    const saltedPassword = sha256(password, salt);
    const result = {
        id: _nextUserId++,
        name: name,
        saltedPassword: saltedPassword,
        salt: salt,
        logins: 0
    };
    _users[name] = result;
    return result;
}

function generateToken() {
    const result = crypto.randomBytes(24).toString("hex");
    return result;
}

const Users = {
    getByName,
    createUser,
    checkPassword,
    generateToken
};
export default Users;
