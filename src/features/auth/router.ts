import express, { Router } from 'express';
import { User } from 'shared/models/User';

const authRouter = Router()

authRouter.post('/register', async function (req, res, next) {
    // TODO: Add the correct implementation
    const newUser = new User.Model({
        name: 'First',
        email: 'email@email.com'
    })
    const createdUser = await newUser.save()
    res.status(200).json(createdUser as User.IBase)
})

authRouter.get('/me', async function (req, res, next) {
    // TODO: Add the correct implementation
    // const user = await User.Model.findById('')
    // res.status(200).json(user as User.IBase)
})

export default authRouter