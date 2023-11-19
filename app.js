const mongoose = require("mongoose");
const express  = require("express");
const User     = require("./public/user");
const app      = express();
const Votacion = require("./public/votacion");
const exphbs   = require("express-handlebars");

const usuariodb = "DarellGutierrez";
const contraseñadb = "12345";
const nombredb = "PaginaWeb";
const uridb = `mongodb+srv://${usuariodb}:${contraseñadb}@DesarrolloWeb.3o4hhff.mongodb.net/${nombredb}?retryWrites=true&w=majority`;
mongoose.connect(uridb) //borré useNewUrlParser y useUnifiedTopology ya que no se usan en las nuevas versiones de node
.then(() => console.log("base de datos conectada")) 
.catch(e => console.log(e))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//codigo chatgpt
app.engine('handlebars', exphbs.engine({
    //defaultLayout: '',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

app.get('/eventos', async (req, res) => {
    const votaciones = await Votacion.find({});
    res.render('votaciones', { votaciones });
});

app.get('/eventos/:id', async (req, res) => {
    const votacion = await Votacion.findById(req.params.id);
    //console.log(votacion);
    res.render('detalleVotacion', { votacion });
});

app.get('/votar', async (req, res) => {
    const votaciones = await Votacion.find({});
    res.render('votar', { votaciones });
});

app.get('/votar/:id', async (req, res) => {
    const votacion = await Votacion.findById(req.params.id);
    //console.log(votacion);
    res.render('confirmarVoto', { votacion });
});

app.post("/sumarUnVoto", async(req, res) =>{
    const {nombreVotacion, opcion} = req.body;
    try {
        const votacion = await Votacion.findOne({nombreVotacion});
        if (!votacion) {
            return res.status(404).send(`VOTACION NO ENCONTRADA`);
        }
        votacion[opcion].votos += 1;
        await votacion.save();
        res.status(200).send("VOTO REGISTRADO");
    }  catch (err) {
        res.status(500).send(`ERROR AL VOTAR: ${err.message}`);
    }
});


//codigo chatgpt


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));


///votacionCreada
app.post("/votacionCreada", async(req, res) =>{
    const {nombreVotacion, opcion1, opcion2, opcion3, fechaCierre} = req.body;
    const votacion = new Votacion({
        nombreVotacion,
        opcion1: {
            nombre: opcion1,
            votos: 0
        },
        opcion2: {
            nombre: opcion2,
            votos: 0
        },
        opcion3: {
            nombre: opcion3,
            votos: 0
        },
        fechaCierre
    });
    try {
        await votacion.save();
        res.status(200).send("VOTACION CREADA");
    }  catch (err) {
        res.status(500).send(`ERROR AL CREAR LA VOTACION: ${err.message}`);
    }
});



app.post("/registrar", async (req, res) => {
    const {username, password} = req.body; 
    const user = new User({username, password});

    try {
        await user.save();
        res.status(200).send("USUARIO REGISTRADO");
    } catch (err) {
        res.status(500).send(`ERROR AL REGISTRAR AL USUARIO: ${err.message}`);
    }
});
app.post("/ingresar", async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});

        if(!user){
            res.status(500).send("EL USUARIO NO EXISTE");
        }
        else{
            user.isCorrectPassword(password, (err, result) =>{
                if(err){
                    res.status(500).send("ERROR AL AUTENTICAR");
                }
                else if(result){
                    res.status(200).send("USUARIO AUTENTICADO CORRECTAMENTE");
                }
                else{
                    res.status(500).send("USUARIO Y/O CONTRASEÑA INCORRECTA");
                }
            })
        }
    } catch (err) {
        res.status(500).send("ERROR AL AUTENTICAR AL USUARIO");
    }
});


app.listen(3000, ()=>{
    console.log("servidor iniciado");
});
module.exports = app;