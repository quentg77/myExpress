import { createServer, IncomingMessage, ServerResponse } from 'http';
import fs, { readFileSync, readFile, read, fsync } from 'fs';

class Express {

	reg = /{{(.*)\|(.*)}}/
	private server: any;
	private routes: any; //Routes;

	constructor() {
		this.routes = {
			'GET': [],
			'POST': [],
			'DELETE': [],
			'PUT': []
		};

		this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
			//const {method, url} = req
			const response = this.handleResponse(res);
			// step 1 : Recupérer la méthode
			const method: string = req.method ? req.method : "";
			// step 2 : Récupérer la route
			const url: string = req.url ? req.url : "";
			// step 3 : Appeler la bonne méthode http
			const route = this.routes[method].find((item: any) => item.url === url)
			if (route !== undefined) {
				route.callback(req, response);
			}
		});
	}

	listen(port: number, callback: Function) {
		this.server.listen(port, callback);
	}

	get(url: string, callback: Function) {
		this.routes.GET.push({ url, callback });
	}

	post(url: string, callback: Function) {
		this.routes.POST.push({ url, callback });
	}

	delete(url: string, callback: Function) {
		this.routes.DELETE.push({ url, callback });
	}

	put(url: string, callback: Function) {
		this.routes.PUT.push({ url, callback });
	}

	handleResponse(res: ServerResponse) {
		const json = (item: any) => {
			res.write(JSON.stringify(item));
			res.end();
		}

		const send = (content: string) => {
			res.write(content);
			res.end();
		}

		return {
			...res, send, json
		}
		//return Object.assign({}, {json}, res)  Attention à l'ordre
	}

	render(fileName: string, callback: (err: Error | null, html: string) => void) {
		const pathName = "pages/" + fileName + ".html.mustache";

		if (!fs.existsSync(pathName)) {
			callback(new Error(`404 page ${fileName} n'existe pas`), "");
			return;
		}

		let fileContent: string = readFileSync(pathName, "utf8");
		callback(null, fileContent);
	}
}

export default function () {
	return new Express()
}
