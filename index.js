#!/usr/bin/node

const http = require("http");
const node_static = require("node-static");

const mongo = require("mongodb").MongoClient;

let server_url = "mongodb://localhost:27017";

mongo.connect(server_url, (error, server) => {
	if (error){
		console.log("Error en la conexion a MongoDB");
		throw error; //return para errores, lanza un error
		}
		
		console.log("Dentro de MongoDB");
	
		let chat_db = server.db("amongmeme");

		chat_db.collection("chat").find({});

});

console.log("Inicializando servidor chat");

/*
let public_files = new node_static.Server("pub");

http.createServer( (request, response) => {

	console.log("Archivo"+request.url);

	public_files.serve(request, response);
}).listen(8080);
*/
