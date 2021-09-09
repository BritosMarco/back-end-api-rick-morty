const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
require("dotenv").config();
require("express-async-errors");
var cors = require("cors");

(async() => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbChar = process.env.DB_CHAR;

    //requires de endpoints
    const home = require("./components/home/home");
    const readById = require("./components/read-by-id/readbyid");
    const readAll = require("./components/read-all/readall");
    const update = require("./components/update/update");
    const create = require("./components/create/create");
    const apagar = require("./components/delete/delete");

    const app = express();
    app.use(express.json());

    const port = process.env.PORT || 3000;
    const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    const options = {
        useUnifiedTopology: true,
    };

    console.info("Conectando ao MongoDB Atlas...");

    const client = await mongodb.MongoClient.connect(connectionString, options);

    console.info("Conexão estabelecida com o MongoDB Atlas!");

    const db = client.db("blue_db");
    const personagens = db.collection("personagens");
    /* 
      const getPersonagensValidas = () => personagens.find({}).toArray(); 

      const getPersonagemById = async(id) =>
          personagens.findOne({ _id: ObjectId(id) }); */

    //CORS

    /* app.all("/*", (req, res, next) => {
                            res.header("Access-Control-Allow-Origin", "*");

                            res.header("Access-Control-Allow-Methods", "*");

                            res.header(
                                "Access-Control-Allow-Headers",
                                "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
                            );

                            next();
                        }); */

    //CORS - NOVO
    //Liberar o CORS  em todas as nossas requisições
    app.use(cors());
    //Ativar todos os pre-flights
    app.options("*", cors());

    //Criando a rota Home
    app.use("/home", home);

    //[GET] GetAllPersonagens
    app.use("/personagens/read-all/", readAll);

    //[GET] getPersonagemById
    app.use("/personagens/read-by-id/", readById);

    //[POST] Adicona personagem
    app.use("/personagens/create", create);

    //[PUT] Atualizar personagem
    app.use("/personagens/update", update);

    //[DELETE] Deleta um personagem
    app.use("/personagens/delete", apagar);

    //Middleware -> Tratamento de erro
    app.use((error, req, res, next) => {
        res.status(error.status || 500).send({
            error: {
                status: error.status || 500,
                message: error.message || "Internal Server Error",
            },
        });
    });

    app.listen(port, () => {
        console.info(`App rodando em http://localhost:${port}`);
    });
})();