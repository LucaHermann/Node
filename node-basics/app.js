const http = require('http'); 
const fs = require('fs'); 

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<div><form action="/messages" method="POST"><input type="text" name="username" /><button type="submit">Create User</button></form></div>');
    return res.end();
  } 

  if (url === '/messages' && method === 'POST') {
    const body = []
    
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const bufferedBody = Buffer.concat(body).toString();
      const message = bufferedBody.split('=')[1];
      fs.writeFile('messages.txt', message, (err) => {
        if (err) {
          res.statusCode = 500;
          console.log(err);
          return res.end();
        }
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Node Basics</title></head>');
  res.write('<body><h1>Node basics</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000); 