import config from "config/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { strings } from "shared/strings";


export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: { message: strings.malformedAuth } });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

        if (!decoded.userId || !decoded.email) {
            return res.status(401).json({ error: { message: strings.invalidToken } });
        }

        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        return res.status(401).json({ error: { message: strings.invalidToken } });
    }

}