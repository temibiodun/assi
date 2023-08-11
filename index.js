const http = require('http');
const fs = require('fs');

const port = 3001


const server = http.createServer((req, res) => {
    console.log({path: req.url, method: req.method})

    if (req.url =='/') {
       const file = fs.readFileSync('./index.html')
       res.setHeader('content-type', 'text/html')
       res.writeHead(200)
       res.write(file)
       res.end()
    }

    if (req.url.endsWith ('.html') && req.method == 'GET') {
      try{ 
        const splitUrl = req.url.split('/')
        console.log({ url: req.url, splitUrl })
        const filename = splitUrl[1]
        const fileLocation = `./${filename}`


        const file = fs.readFileSync(fileLocation)
        res.setHeader('content-type', 'text/html')
        res.writeHead(200)
        res.write(file)
        res.end()
    } catch (error) {
        const file = fs.readFileSync('./404.html')
        res.setHeader('content-type', 'text/html')
        res.writeHead(200)
        res.write(file)
        res.end() 
    }
    }
})

server.listen(port,() => {
    console.log(`Server running at port ${port}`)
})



