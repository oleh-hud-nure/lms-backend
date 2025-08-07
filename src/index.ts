import express, { Express as Exp } from 'express'
import rootRouter from './router'
import mongoose from 'mongoose'
import cors from 'cors';
import config from 'config/config'


mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)
mongoose.connect(config.mongoUri).then((v) => {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/v1', rootRouter)

    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    })
})
