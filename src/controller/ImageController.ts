import { Request, Response } from 'express';
import Image from '../database/schemas/Image';
import fs from "fs"

class ImageController {

    // Select all images
    async find(request: Request, response: Response) {

        try {
            const image = await Image.find();
            return response.status(200).json(image)
        } catch (error) {
            return response.status(500).json({
                error: 'Something wrong happened, try again',
                message: error
            })
        }
    }

    // View one image
    async imageID(request: Request, response: Response) {
        const id = request.params.id

        try {
            const image = await Image.findById(id)

            if (!image) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'Imagem não encontrada!',
                });
            }

            response.status(200).json({
                message: 'Deu certo!',
                image
            })
        } catch (error) {
            return response.status(500).json({
                error: 'Erro server!',
                message: error
            })
        }

    }

    // Registra imagem
    async registerImage(request: Request, response: Response) {
        const { name, description } = request.body;
        const baseFile64: string = Buffer.from(request.file?.buffer).toString("base64")

        try {
            const imageExists = await Image.findOne({ image: baseFile64 })
            const nameExists = await Image.findOne({name})

            if (!name) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'O nome é obrigatorio!',
                });
            }

            if(nameExists) {
                return response.status(422).json({
                    error:  'Fez merda',
                    message: 'O nome informado já foi utilizado'
                });
            }

            if (!description) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'A descrição é obrigatoria!',
                });
            }

            if (imageExists) {
                return response.status(422).json({
                    error: 'Fez merda',
                    message: 'A imagem já existe!',
                });
            }

            
            
            
            const image = await Image.create({
                name,
                description,
                image: baseFile64
            });

            return response.json({
                message: 'Imagem registrada com sucesso!',
                image
            });
        } catch (error) {
            return response.status(500).json({
                error: 'Registration failed',
                message: error
            })
        }
    }

    // Update Image
    async updateImage(request: Request, response: Response) {
        const id = request.params.id
        const { description, name } = request.body

        const imageUpdate = {
            description,
            name
        }

        const imageExists = await Image.findOne({ _id: id })

        if (!imageExists) {
            return response.status(422).json({
                error: 'Fez merda!',
                message: 'Imagem não encontrada!'
            })
        }

        try {

            await Image.updateOne({ _id: id }, imageUpdate)

            return response.status(200).json({
                message: 'Imagem atualizada',
                imageUpdate
            })


        } catch (error) {
            return response.status(500).json({
                error: 'Update failed',
                message: error
            })
        }

    }

    // Delete Image
    async deleteImage(request: Request, response: Response) {
        const id = request.params.id
        const imageExists = await Image.findOne({ _id: id })

        if (!imageExists) {
            return response.status(422).json({
                error: 'Fez merda!',
                message: 'Imagem não encontrada!'
            })
        }

        try {
            await Image.deleteOne({ _id: id })

            response.status(200).json({
                message: 'Imagem exluida!'
            })

        } catch (error) {
            return response.status(500).json({
                error: 'Erro server!',
                message: error
            })
        }
    }

}

export default new ImageController