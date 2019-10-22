import express from './express'

const app = express();
const port = 3000;

// Routes http
app.get('/', (req: any, res: any) => {
	console.log('get');
});

app.get('/api', (req: any, res: any) => {
	console.log('get API');
	res.json({ hello: 'From API' });
});

app.post('/sign-up', (req: any, res: any) => {
	console.log('post sign-up');
});

app.put('/update-login', (req: any, res: any) => {
	console.log('update login');
});

app.delete('/delete-login', (req: any, res: any) => {
	console.log('delete login');
});

// Render
app.get('/home', (req: any, res: any) => {
	app.render('home', {name: "toto", test: "taTA"}, (err, html) => {
		if (err) {
			res.send(err);
		}
		res.send(html);
	});
});

app.listen(port, () => {
	console.log(`Server is listenning on ${port}`);
});
