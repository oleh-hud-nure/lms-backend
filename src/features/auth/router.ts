import express, { Router } from 'express';

const authRouter = Router()

authRouter.get('/me', async function (req, res, next) {
    res.json({
        id: 'id',
        name: 'Surname'
    })
})

export default authRouter