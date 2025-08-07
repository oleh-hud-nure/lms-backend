import express, { Router } from 'express';
import { User } from 'shared/models/User';
import { strings } from 'shared/strings';
import bcrypt from 'bcrypt'
import config from 'config/config';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from 'shared/middlewares/is_authenticated';

const authRouter = Router()

const TOKEN_EXPIRES_IN = '30m'

authRouter.post('/register', async function (req, res, next) {
    try {
        const { name, email, password, passwordConfirmation } = req.body || {};

        const nameError = _validateName(name)
        const emailError = _validateEmail(email)
        const passwordError = _validatePassword(password)
        const confirmationError = _validateConfirmation(password, passwordConfirmation)

        if (nameError || emailError || passwordError || confirmationError) {
            res.status(422).json({
                error: {
                    name: nameError,
                    email: emailError,
                    password: passwordError,
                    passwordConfirmation: confirmationError,
                }
            })
            return
        }

        const sameEmailUser = await User.Model.findOne({ email })
        if (sameEmailUser) {
            res.status(422).json({
                error: {
                    email: strings.emailInUse,
                }
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User.Model({
            email,
            name,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            config.jwtSecret,
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        return res.status(200).json({
            token,
            user: newUser.toJSON(),
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: {
                message: strings.registerError,
            },
        });
    }
})

authRouter.get('/me', isAuthenticated, async function (req, res, next) {
    const userId = req.userId;

    if (!userId) {
        res.status(401).json({
            error: {
                message: strings.unauthenticated,
            }
        })
        return
    }

    const user = await User.Model.findById(userId)

    if (!user) {
        res.status(401).json({
            error: {
                message: strings.unauthenticated,
            }
        })
        return
    }

    res.status(200).json(user.toJSON())
})

export default authRouter


function _validateEmail(email: string | undefined): string | undefined {
    if (!email) return strings.noField(strings.emailShort);

    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!regex.test(email)) return strings.incorrectEmail;
}


function _validatePassword(password: string | undefined): string | undefined {
    if (!password) return strings.noField(strings.password);

    if (password.length < 8) return strings.min8
}

function _validateConfirmation(password: string | undefined, passwordConfirmation: string | undefined) {
    if (password !== passwordConfirmation) return strings.confirmationError
}

function _validateName(name: string) {
    if (!name) return strings.noField(strings.name)
}
