#!/usr/bin/node

const http = require("http");
const node_static = require("node-static");

const mongo = require("mongodb").MongoClient; //para conectarse a mongo

let server_url = "mongodb://localhost:27017"; //servidor de mongodb

let chat_db; //la definimos global para acceder desde fuera

mongo.connect(server_url, (error, server) => {
	if (error){
		console.log("Error en la conexion a MongoDB");
		throw error; //throw es un return para errores, lanza un error
		}
		
		console.log("Dentro de MongoDB");
	
		chat_db = server.db("amongmeme"); //conexion a la base de datos
});

function sendChat(response){

	let cursor = chat_db.collection("chat").find({}); //puntero a los datos

	let data = [];

	//es un for.each pero propio de los cursores
	cursor.each( (error, doc) => {
		if (error){
			console.log("Error al ller el documento");
			throw error;
		}
		
		data.push(doc);

	//CUANDO SEA EL ULTIMO CASO HACEMOS ESTO
	//transformar el array 'data' a string y enviarselo al cliente
	//response.write(data);
	//response.end();

	});
	console.log(data);
}


console.log("Inicializando servidor chat");


let public_files = new node_static.Server("pub"); //directorio de nuestro sismeta y por defecto de nuestro servidor web

http.createServer( (request, response) => {
	
	console.log("Archivo "+request.url);
	
	if (request.url == "/chat"){
		console.log("Nos piden el chat de mongodb");
		response.writeHead(200, {'Content-Type':'text/plain'}); //error 200 es 'todo encontrado' es decir esta bien
		//response.write("<p>Ahora viene el chat</p>");
		//response.end();

		sendChat(response);
	}
	else{
		public_files.serve(request, response);
	}
                 
}).listen(8080);
