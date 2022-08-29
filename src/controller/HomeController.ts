import {Request, Response} from "express";

class HomeController{
    //acess public
    async home(request: Request,response: Response ){
        try {
            return response.status(200).json({msg: "Opá, deu certo seja bem-vindo!"})
        } catch (error) {
            return response.status(500).json({
                error: "Something wrong happened, try again",
                message: error
            })
        }
    }
}

export default new HomeController