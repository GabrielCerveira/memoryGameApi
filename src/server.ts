import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import './config/env'

const app = express();

app.use(express.json());

//Routes of API 
app.use(routes);

//password: zSGehVFqzW5JyVNk
//mongodb+srv://gabriel:zSGehVFqzW5JyVNk@memorygame.axdfs1e.mongodb.net/MemoryGame?retryWrites=true&w=majority

//Conecta MongoDB
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@memorygame.axdfs1e.mongodb.net/MemoryGame?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Conectamos ao MongoDB!")
        app.listen(3000, () => {
            console.log("Server is listening");
        })
    })
    .catch((err) => console.log(err))

