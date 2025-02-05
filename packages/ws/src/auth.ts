import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config/index.js";
import prismaClient from "@repo/db/client";

interface AuthRequest extends Request {
    userId?: string
}

const authenticateSocket = async(req: AuthRequest, socket: any): Promise<any> => {
    const token = req.cookies?.token

    if(!token) {
        socket.send("Unauthorized, missing token");
        socket.close();
        return;
    }

    const verified = jwt.verify(token, JWT_SECRET as string) as JwtPayload

    try {
        
        const existingUser = await prismaClient.user.findFirst({
            where: {
                id: verified.id
            }
        })
        
        if (!existingUser) {
            socket.send("Unauthorized, user not found");
            socket.close();
            return;
        }

        req.userId =  verified.id
    } catch(e) {
        socket.send("Failed to authenticate, exited with error:" + e);
        socket.close();
    }

}

export default authenticateSocket;