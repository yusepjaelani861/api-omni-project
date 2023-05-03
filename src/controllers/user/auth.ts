import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import Controllers from "../controller";
import asyncHandler from "../../middleware/async";
import { body, validationResult } from "express-validator";
import { sendError } from "../../libraries/rest";

class Authentication extends Controllers {
    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new sendError('Please provide an email and password', errors.array(), 'VALIDATION_ERROR'));
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new sendError('Please provide an email and password', [], 'PROCESS_ERROR'));
        }

        // cek is email or phone
        if (!email.includes('@')) {
            const user = await this.user.findUser({ phone_number: email });
            if (!user) {
                return next(new sendError('Invalid credentials', [], 'UNAUTHORIZED'));
            }

            const isMatch = await bcryptjs.compare(password, user.password);

            if (!isMatch) {
                return next(new sendError('Invalid credentials', [], 'UNAUTHORIZED'));
            }

            return this.user.sendTokenResponse(user, res);
        } else {
            const user = await this.user.findUser({ email });

            if (!user) {
                return next(new sendError('Invalid credentials', [], 'UNAUTHORIZED'));
            }

            const isMatch = await bcryptjs.compare(password, user.password);

            if (!isMatch) {
                return next(new sendError('Invalid credentials', [], 'UNAUTHORIZED'));
            }

            return this.user.sendTokenResponse(user, res);
        }
    })

    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new sendError('Please provide an email and password', errors.array(), 'VALIDATION_ERROR'));
        }

        const { email, password, name, phone_number, type } = req.body;

        if (type === 'email') {
            if (!email || !password || !name || !phone_number) {
                return next(new sendError('Please provide an email, password, name and phone number', [], 'PROCESS_ERROR'));
            }
        }

        if (type === 'phone') {
            if (!phone_number || !password) {
                return next(new sendError('Please provide a phone number', [], 'PROCESS_ERROR'));
            }
        }

        let user;
        if (type === 'email') {
            user = await this.user.findUser({ email });
        }

        if (type === 'phone') {
            user = await this.user.findUser({ phone_number });
        }


        if (user) {
            return next(new sendError('User already exists', [], 'PROCESS_ERROR'));
        }

        let cekRole = await this.role.findRole({ name: 'Free' });
        if (!cekRole) {
            cekRole = await this.role.createRole({ name: 'Free' });
        }

        const role = await this.role.findRole({ name: 'Free' });
        if (!role) {
            return next(new sendError('Role not found', [], 'PROCESS_ERROR'));
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await this.user.createUser({
            role: {
                connect: {
                    id: role.id
                }
            }, email, password: hashedPassword, name, phone_number
        });

        return this.user.sendTokenResponse(newUser, res);
    })

    public authMe = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        console.log(req.user.id)
        const user = await this.user.findUser({ id: req.user.id });

        if (!user) {
            return next(new sendError('User not found', [], 'PROCESS_ERROR'));
        }

        return this.user.sendTokenResponse(user, res);
    })

    public validation = (method: string) => {
        switch (method) {
            case 'login': {
                return [
                    body('email', 'Please provide a valid email').notEmpty(),
                    body('password', 'Please provide a password').exists()
                ]
            }

            case 'register': {
                return [
                    body('email', 'Please provide a valid email').optional().custom((value, { req }) => {
                        return this.user.findUser({ email: value }).then(user => {
                            if (user) {
                                return Promise.reject('E-mail already in use');
                            }
                        });
                    }),
                    body('password', 'Please provide a password').exists()
                        .isLength({ min: 6 })
                        .withMessage('Password must be at least 6 characters long'),
                    body('password_confirmation', 'Please provide a password confirmation').exists()
                        .custom((value, { req }) => value === req.body.password)
                        .withMessage('Password confirmation does not match password'),
                    body('name', 'Please provide a name').exists(),
                    body('phone_number', 'Please provide a phone number').optional()
                ]
            }

            default: {
                return [];
            }
        }
    }
}


export default Authentication;