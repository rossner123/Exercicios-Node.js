const express = require('express')
const app = express()
const Sequelize = require('sequelize')

//Conexão com o banco de dados
const sequelize = new Sequelize("exercicio", "root", "bruninho1", {
	host: "localhost",
	dialect: "mysql"
})

//Configurar o EJS
app.set('view engine', 'ejs')

// Middleware para processar os dados do formulário
app.use(express.urlencoded({ extended: true }));

const Post = sequelize.define("postagens", {
	titulo: {
		type: Sequelize.STRING
	},
	conteudo: {
		type: Sequelize.TEXT
	}
})

/*Post.sync({force: true}).then(() => {
	console.log("Tabela criada")
})*/

//Rotas
app.get("/", async (req, res) => {
	try{
		const posts = await Post.findAll({order: [['id', 'DESC']]})
		res.render("home", {posts})
	} catch(erro){
		res.send("Erro ao buscar postagens: " + erro)
	}
})

app.get("/cad", (req,res) => {
	res.render("forms")
})

app.post("/add", async (req, res) => {
	try{
		await Post.create({
			titulo: req.body.titulo,
			conteudo: req.body.conteudo
		})
		res.redirect("/")
	} catch(erro){
		res.send("Erro ao criar postagem: " + erro)
	}
})

app.get("/deletar/:id", async (req, res) => {
	try{
		await Post.destroy({where: {id: req.params.id} })
		res.redirect("/")
	} catch(erro){
		res.send("Erro ao deletar postagem: " + erro)
	}
})

app.post("/editar/:id", async (req, res) => {
	try{
		await Post.update(
			{
				titulo: req.body.titulo,
				conteudo: req.body.conteudo
			},
			{where : {id: req.params.id} }
		)
		res.redirect("/")
	} catch(erro){
		res.send("Erro ao editar postagem: " + erro)
	}
})

app.listen(3000, () => {
	console.log("Servidor rodando na url http://localhost:3000")
})