const express = require('express')
const app = express()

//Conexão com o banco de dados MySQL
const Sequelize = require('sequelize')
const sequelize = new Sequelize('testeAula', 'root', "bruninho1", {
	host: "localhost",
	dialect: "mysql"
})


const Usuario = sequelize.define("Usuario", {
	nome: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING,
		unique: true
	},
	idade: {
		type: Sequelize.INTEGER
	}
})

async function conectarBanco(){
	try{
		await sequelize.sync()
		console.log("Banco sincronizado com sucesso!")
	} catch(err){
		console.log("Erro ao sincronizar banco: " + err)
	}
}

async function criarUsuario(nome, email, idade){
	try{
		const usuario = await Usuario.create({nome, email, idade})
		console.log("Usuario criado: " + usuario.toJSON())
	} catch (err){
		console.log("Erro ao criar usuario: " + err)
	}
}

async function atualizarUsuario(email, novaIdade){
	try{
		const resultado = await Usuario.update({idade: novaIdade}, {where: {email} })
		if(resultado[0] > 0){
			console.log(`Usario com email ${email} atualizado para idade ${novaIdade}`)
		}
		else{
			console.log("Nenhum usuario para atualizar")
		}
	}catch(err){
		console.log("Erro ao atualizar usuario: " + err)
	}
}

//Cria a tabela se ela não existir
sequelize.sync().then(() => {
	console.log("Tabela criada")
}).catch(err => console.log("Erro ao criar tabela: " + err))

async function buscarUsuarios(){
	try{
		const usuarios = await Usuario.findAll()
		console.log("Usuários cadastrados: " + JSON.stringify(usuarios, null, 2))
	} catch(err){
		console.log("Erro ao buscar usuarios: " + err)
	}
}

async function encontrarUsuario(email){
	try{
		const usuario = await Usuario.findOne({where: {email} })
		if(usuario){
		console.log("Usuario encontrado: " + usuario.toJSON())
	}
	else{
		console.log("Nenhum usuario encontrado com esse email")
	}
	} catch(err){
		console.log("Erro ao encontrar usuario: " + err)
	}
}

async function deletarUsuario(email){
	try{
		const resultado = await Usuario.destroy({where: {email} })
		if(resultado > 0){
			console.log(`Usuario com email ${email} deletado`)
		}
		else{
			console.log("Nenhum usuario encontrado para deletar")
		}
	} catch(err){
		console.log("Erro ao deletar usuario: " + err)
	}
}

//Rotas
app.get("/", (req, res) => {
	res.send("Hello World")
} )

app.get("/sobre", (req, res) => {
	res.send("Página sobre")
})

app.listen(3000, async () => {
	console.log("rodando na porta 3000...")
	await conectarBanco()
})
