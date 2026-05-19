import crypto from "node:crypto";

export const randomToken = ()=>{
    return crypto.randomInt(10000, 100000).toString();
}

