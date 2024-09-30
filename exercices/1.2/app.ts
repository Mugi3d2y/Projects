import express, { ErrorRequestHandler } from "express";

import filmsRouter from "./routes/films";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let compteur = 0;
app.use((req, _res, next) =>{
    if (req.method === "GET"){
        compteur++;
        console.log(`GET counter : ${compteur}`);
    }
    next();
})


app.use("/films", filmsRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    return res.status(500).send("Something broke!");
};
  
app.use(errorHandler);
  

export default app;
