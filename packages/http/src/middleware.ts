import prismaClient from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers.authorization

    if(!authHeaders || !authHeaders.startsWith("Bearer")) {
        res.status(411).json({message: "wrong headers or no headers"})
        return;
    }

    const token = authHeaders.split(' ')[1]

    if(!token) {
        res.status(404).json({message: "Token not found"})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        // @ts-ignore
        req.id = decoded.id
        next()
    } catch(e) {
        console.log(e);
    }
}

