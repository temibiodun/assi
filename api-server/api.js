const http = require('http');

const port = 3001

const students = []; 


const handleResponse = (req, res) => ({ code = 200, error = null, data = null}) => { 
    res.setHeader('content-type', 'application/json') 
    res.writeHead(code)
    res.write(JSON.stringify({ data, error }))
    res.end()
}

const bodyParser = (req, res, callback) => {
    const body = [];

    req.on('data', (chunk) => { 
        body.push(chunk) 
    })

    req.on('end', () => { 
        if (body.length) { 
            const parsedBody = Buffer.concat(body).toString() 
            req.body = JSON.parse(parsedBody); 
        }

        callback(req, res) 
    })
}

const handleRequest = (req, res) => { 

    const response = handleResponse(req, res)
}



const server = http.createServer((req, res) => {

   
    if (req.url === '/v1/students'  && req.method === 'POST') {

        const data = [];

        req.on('data', (chunk) => {
            console.log({ chunk })
            data.push(chunk)
        })

        req.on('end', () => {
            const bufferBody = Buffer.concat(data).toString();
            console.log({ bufferBody })
            const bodyOfRequest = JSON.parse(bufferBody)
            console.log({ bodyOfRequest})

            students.push({...bodyOfRequest, id: Math.floor(Math.random() * 500).toString()})
            console.log({students})

        })

        res.write(JSON.stringify({data: students}))
        res.end()

    }

    if (req.url === '/v1/students'  && req.method === 'GET') {
        res.setHeader('content-type', 'application/json')
        res.writeHead(200)
        res.write(JSON.stringify({data: students}))
        res.end()

    }



    if (req.url.startsWith('/v1/students')  && req.method === 'GET') {
        const id = req.url.split('/')[3]
        console.log({id})
        res.end()

        const studentIndex = students.findIndex((student) => student.id === id)

        if (studentIndex === -1) {
            res.setHeader('content-type', 'application/json')
            res.writeHead(404)
            res.write(JSON.stringify({data: null, error: 'student not found'}))
            return res.end()
        }


        const student = students[studentIndex]

        res.setHeader('content-type', 'application/json')
        res.writeHead(200)
        res.write(JSON.stringify({data: student, error: null}))
        return res.end()


    }
    
    if (req.url.startsWith('/v1/students/') && req.method === 'PATCH') { 
        const id = req.url.split('/')[3]

        const studentIndex = students.findIndex((student) => student.id === id)

        if (studentIndex === -1) { 
            return response({ code: 404, error: 'Student not found' })
        }


        const student = { ...students[studentIndex], ...req.body } 

        return response({ data: student, code: 200 }) 

    }



    if (req.url.startsWith('/v1/students/') && req.method === 'DELETE') { 
        const id = req.url.split('/')[3]

        const studentIndex = students.findIndex((student) => student.id === id) 

        if (studentIndex === -1) { 
            return response({ code: 404, error: 'Student not found' }) 
        }

        students.splice(studentIndex, 1)

        return response({ data: students, code: 200 })
    }



})


server.listen(port,() => {
    console.log(`Server running at port ${port}`)
})
