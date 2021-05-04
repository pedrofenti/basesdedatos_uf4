#!/usr/bin/node

const http = require("http");
const node_static = require("node-static");
 
//Para conectarse a mongo
const mongo = require("mongodb").MongoClient;

//Servidor de mongodb
let server_url = "mongodb://localhost:27017";

//la definimos global para acceder desde fuera
let chat_db;

mongo.connect(server_url, (err, server) => {
	if (err){
		console.log("Error en la conexión a MongoDB");
		//throw es un return para errores, lanza un error
		throw err;	
	}

	console.log("Dentro de MongoDB");

	//conexion a la base de datos
	chat_db = server.db("amongmeme");
	
});


console.log("Inicializando servidor chat");

//directorio de nuestro sismeta y por defecto de nuestro servidor web
let public_files = new node_static.Server("pub");

http.createServer( (request, response) => {
	if (request.url == "/chat"){
		//console.log("Entrando en el chat");
		
		//puntero a los datos
		let cursor = chat_db.collection("chat").find({});

		cursor.toArray().then( (data) => {
			//console.log(data);

			//error 200 es 'todo encontrado' es decir esta bien
			response.writeHead(200, {'Content-Type': 'text/plain'});			
			
			response.write( JSON.stringify(data) );

			response.end();
		});

		return;
	}

	if (request.url == "/submit"){
		console.log("Envío de datos");

		let body = [];

		//chunk son los bloques de datos
		request.on('data', (chunk) => {

			body.push(chunk);

		}).on('end', () => {
			
			//convierte a objetos 
			let chat_data = JSON.parse(Buffer.concat(body).toString());

			//insertamos el valor en la base de datos
			chat_db.collection("chat").insertOne({
				user: chat_data.chat_user,
				msg: chat_data.chat_msg,
				date: Date.now()
			}); 

		});

		response.end();

		return;
	}

	public_files.serve(request, response);

}).listen(8080);
