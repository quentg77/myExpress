import { createServer, IncomingMessage, ServerResponse } from 'http';
import fs, { readFileSync, readFile, read, fsync } from 'fs';
import * as path from 'path';

export interface MyHttpResponse {
	json: (item: any) => void
	send: (content: string) => void
}

export interface MyHttpRequest { }

class Express {
	// You HAVE TO replace any by the real signature
	[x: string]: any

	private server: any;
	private routes: any = {};

	private readonly WWW_DIRECTORY = 'www';
	private readonly TEMPLATE_PAGE_DIRECTORY = 'pages';
	private readonly TEMPLATE_EXTENSION = '.html.mustache';

	constructor() {
		this._initialize();
	}

	private _initialize() {
		for (const verb of ['GET', 'POST', 'PUT', 'DELETE']) {
			this.routes[verb] = [];
			// You HAVE TO replace any by the real signature
			this[verb.toLowerCase()] = (url: string, callback: any) => {
				this.routes[verb].push({ url, callback });
			}
		}

		this.server = createServer(
			(req: IncomingMessage, res: ServerResponse): void => {
				const { method, url } = req;

				if (!method || !url) {
					return;
				}

				const response: MyHttpResponse = this._overrideReponse(res);

				const route = this.routes[method].find((item: { url: string }) => item.url === url);
				if (!route) {
					return;
				}

				route.callback(req, response);
			}
		)
	}

	private _overrideReponse(res: ServerResponse): MyHttpResponse {
		const json = (item: any): void => {
			res.write(JSON.stringify(item));
			res.end();
		}

		const send = (content: string): void => {
			res.write(content);
			res.end();
		}

		return { ...res, json, send };
	}

	private _upper(str: string): string {
		return str.toUpperCase();
	}

	private _lower(str: string): string {
		return str.toLowerCase();
	}

	listen(port: number, callback: Function) {
		this.server.listen(port, callback);
	}

	render(
		fileName: string,
		values: any,
		callback: (error: Error | null, html: string | null) => void
	) {
		// set template filename
		const pathName = path.join(
			process.cwd(),
			this.WWW_DIRECTORY,
			this.TEMPLATE_PAGE_DIRECTORY,
			`${fileName}${this.TEMPLATE_EXTENSION}`
		)

		console.log(pathName);

		// check if exist
		if (!fs.existsSync(pathName)) {
			callback(new Error(`404 Page ${fileName} doesn't exist`), null)
			return
		}

		// read data mustache
		const content = fs.readFileSync(pathName, 'utf-8')

		// search by regex and return new string with data
		const processContent = content.replace(
			/{{(\w+)( ?[|] ?)?(\w+)?}}/gi,
			(item: string, ...args: any[]): string => {

				if (!values) {
					return 'undefined';
				}
				
				// get founded mustache
				const [key, pipe, transform] = args;

				// return new value if exist on our object
				
				const v = values[key];

				// if not founded
				if (!v) {
					return 'undefined';
				}

				// ...else apply transform method
				if (pipe && transform) {
					const func = this[`_${transform}`];
					if (func) {
						return func(v);
					}
				}
				console.log(v);
				return v;
			}
		)

		// call with new content
		callback(null, processContent)
	}
}

export default function () {
	return new Express()
}
