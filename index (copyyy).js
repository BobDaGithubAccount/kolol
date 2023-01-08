const express = require('express');
const app = express();
const https = require('https');

// Pass all API calls through our provider as to load external images, files 
// and any other requests.
const parse_bundle = (html, url) => {
	// let matcher = new RegExp('href="[a-zA-Z.?\/;=:&]+"');
	
	return html.replace(matcher, '');
}

app.get('/browse/:url', (req, res) => {
	let url = req.params.url.replace(":", "/")
	let bundle;

	https.get("https://" + url, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			let matcher = new RegExp('href="[a-zA-Z.?\/;=:&]+"');
			let matches = [...matcher.exec(data)];

			console.log(matches)
			res.send(data.replace("url", "https://kolol.119096.repl.co/browse"))
		});

	}).on("error", (err) => {
		res.send(err);
	});
})

app.listen(3000, () => {
	console.log(`listening on port 3000`)
})