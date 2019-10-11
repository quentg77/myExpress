import http, { Server, ServerResponse, IncomingMessage } from 'http'

let server: Server = http.createServer(function (req: IncomingMessage, res: ServerResponse) {
	res.writeHead(200);
	res.end('Salut !');
});

server.listen(8080, (): void => { console.log("Server is listening on port 8080") });