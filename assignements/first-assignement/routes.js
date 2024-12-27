const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>First Assignement</title></head>');
    res.write('<body><h1>Welcome to the first assignement of this course!</h1></body>');
    res.write('<div><form action="/create-user" method="POST"><input type="text" name="username" /><button type="submit">Create User</button></form></div>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/users') {
    res.write('<html>');
    res.write('<head><title>Users</title></head>');
    res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
    const bufferedBody = Buffer.concat(body).toString();
      const username = bufferedBody.split('=')[1];
      console.log(username);
      return res.end();
    });
  }
}

module.exports = requestHandler;