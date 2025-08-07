import express, { Router } from 'express'
import authRouter from 'features/auth/router'

const rootRouter = Router()

rootRouter.use('/auth', authRouter)

export default rootRouter