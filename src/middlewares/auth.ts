import * as jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

export const auth = async(request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return response.status(401).json({
            message: "Acesso negado!"
        })
    }

    try {
        const secret = '5e3gfb37ry7yr4y47rbffwjfkfoekfwonyafeh'

        await jwt.verify(token, secret)

        next()
    } catch (error) {
        response.status(400).json({
            message: "Token inválido!"
        })
    }

}
