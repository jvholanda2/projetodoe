//configurando o server
const express = require("express")
const server = express()

//configurar o server para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar o body do formulario
server.use(express.urlencoded({extended: true}))

//configurar a conexeão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'senha112233',
    host: 'localhost',
    post: 5432,
    database: 'doe'
})

//configurando a tempelate engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true, 
})

//lista de doadores: array 
/*const donors = [
    {
        name: "Diego Fernandes",
        blood: "AB+"
    },
    {
        name: "João Vitor",
        blood: "B+"
    },
    {
        name: "Matheus Fernandes",
        blood: "A+"
    },
    {
        name: "Robson Fernandes",
        blood: "O-"
    }

]
*/
//configurar a apresentação da pagina
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados.")


        const donors = result.rows

        return res.render("index.html", {donors})
    })
   
})

server.post("/", function(req, res){
    //capturar os dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //tratamento para caso falte algum campo
    if (name == "" || email == "" || blood == ""){
       return res.send("Todos os campos são obrigatórios.")
    }

    //colocar os valores no banco de dados
    const query ="INSERT INTO donors(name, email, blood) VALUES ($1,$2,$3)"
    

    const values = [name, email, blood]
        
    db.query(query, values, function(err){
        //fluxo de erro
        console.log(err)
        if (err) return res.send("Erro no banco de dados.")
        
        //fluxo ideal
        return res.redirect("/")

    })
    

})


//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o server.")
}) /*passar a porta do servidor*/