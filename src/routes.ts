import { Router } from "express"
import { auth } from "../src/middlewares/auth"
import multer from "multer"
import HomeController from "./controller/HomeController"
import ImageController from "./controller/ImageController";
import UserController from "./controller/UserController"


//var upload = multer({ dest: './uploads/' })
var upload = multer({ storage: multer.memoryStorage() })


const routes = Router();

//Routes home
routes.get("/", HomeController.home)

//Routes user create and auth
routes.post("/user", UserController.create)
routes.post("/auth/user", UserController.auth)

//Auth
routes.use(auth)

//Routes user
routes.get("/user/:id", UserController.userID)
routes.get("/user/delete/:id", UserController.deleteUser)
routes.patch("/user/update/:id", UserController.updateUser)
routes.get("/users", UserController.find)

//Routes image
routes.post("/image/upload", upload.single('file'), ImageController.registerImage)
routes.get("/image/delete/:id", ImageController.deleteImage)
routes.patch("/image/upadate/:id", ImageController.updateImage)
routes.get("/images", ImageController.find)
routes.get("/image/:id", ImageController.imageID)


export default routes