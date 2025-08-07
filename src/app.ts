import express from 'express'
import rootRouter from './router'

const app = express()

app.use(express.json())

app.use('/api/v1', rootRouter)

export default app;
