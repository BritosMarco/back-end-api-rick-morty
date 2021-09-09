const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

(async() => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbChar = process.env.DB_CHAR;

    const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    const options = {
        useUnifiedTopology: true,
    };

    const client = await mongodb.MongoClient.connect(connectionString, options);

    const db = client.db("blue_db");
    const personagens = db.collection("personagens");

    const getPersonagensValidas = () => personagens.find({}).toArray();

    /*     const getPersonagemById = async(id) =>
                            personagens.findOne({ _id: ObjectId(id) }); */

    router.use(function timelog(req, res, next) {
        next();
        console.log("Time: ", Date.now());
    });

    //GET ALL

    router.get("/", async(req, res) => {
        res.send(await getPersonagensValidas());
    });
})();
module.exports = router;