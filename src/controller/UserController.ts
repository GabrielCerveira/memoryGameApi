import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs';
import User from '../database/schemas/User';
import '../config/env.ts'

const secret = '5e3gfb37ry7yr4y47rbffwjfkfoekfwonyafeh'

class UserController {

    // Select all users
    async find(request: Request, response: Response) {

        try {
            const users = await User.find();

            return response.status(200).json(users)
        } catch (error) {
            return response.status(500).json({
                error: 'Something wrong happened, try again',
                message: error
            })
        }
    }

    // View one user
    async userID(request: Request, response: Response) {
        const id = request.params.id

        try {
            const user = await User.findById(id, '-password')

            if (!user) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'Usuário não encontrado!',
                });
            }

            response.status(200).json({
                message: 'Deu certo!',
                user
            })
        } catch (error) {
            return response.status(500).json({
                error: 'Erro server!',
                message: error
            })
        }

    }

    // Create User
    async create(request: Request, response: Response) {
        const { name, email, password, confirmPassword } = request.body;

        try {
            const userExists = await User.findOne({ email })

            if (!name) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'O nome é obrigatorio!',
                });
            }

            if (!email) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'O email é obrigatorio!',
                });
            }

            if (userExists) {
                return response.status(400).json({
                    error: 'Fez merda',
                    message: 'O email já existe!',
                });
            }

            if (!password) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'A senha é obrigatoria!',
                });
            }

            if (!confirmPassword) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'A confirmação da senha é obrigatoria!',
                });
            }

            if (password !== confirmPassword) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'As senhas não conferem!',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            return response.json({
                message: 'Usuário criado com sucesso!',
                user
            });
        } catch (error) {
            return response.status(500).json({
                error: 'Registration failed',
                message: error
            })
        }
    }

    // Update User
    async updateUser(request: Request, response: Response) {
        const id = request.params.id
        const { email, name } = request.body

        const userUpdate = {
            email,
            name
        }

        const userExists = await User.findOne({ _id: id })

        if (!userExists) {
            return response.status(422).json({
                error: 'Fez merda!',
                message: 'Usuário não encontrado!'
            })
        }

        try {

            await User.updateOne({ _id: id }, userUpdate)

            return response.status(200).json({
                message: 'Usuário atualizado',
                userUpdate
            })


        } catch (error) {
            return response.status(500).json({
                error: 'Update failed',
                message: error
            })
        }

    }

    // Delete User
    async deleteUser(request: Request, response: Response) {
        const id = request.params.id
        const userExists = await User.findOne({ _id: id })

        if (!userExists) {
            return response.status(422).json({
                error: 'Fez merda!',
                message: 'Usuário não encontrado!'
            })
        }

        try {
            await User.deleteOne({ _id: id })

            response.status(200).json({
                message: 'Usuário exluido!'
            })

        } catch (error) {
            return response.status(500).json({
                error: 'Erro server!',
                message: error
            })
        }
    }

    // Validation login and create token
    async auth(request: Request, response: Response) {
        const { email, password } = request.body;

        try {
            //check if email is empty
            if (!email) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'O email é obrigatorio!',
                });
            }

            //check if user exist
            const userCheck: any = await User.findOne({ email })

            if (!userCheck) {
                return response.status(400).json({
                    error: 'Fez merda',
                    message: 'O email não existe!',
                });
            }

            //check if password is empty
            if (!password) {
                return response.status(404).json({
                    error: 'Fez merda',
                    message: 'A senha é obrigatoria!',
                });
            }

            //check if password match
            if (await bcrypt.compare(password, userCheck.password)) {
                console.log('entrou')
                //Token de confirmação

                const token = jwt.sign({ id: userCheck._id }, secret)

                return response.status(200).json({
                    msg: 'Autenticação deu certo!',
                    token
                })
            }

        } catch (error) {
            return response.status(500).json({
                error: 'Could not login!',
                message: error
            })
        }
    }


}

export default new UserController