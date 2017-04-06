
import * as express from 'express';

export let server = express();

server.get('/', (req, res) => {
    res.send(req.query);
})
// server.post('/', (req, res) => {
//     console.log(req.query)
// })

//ma9851//imd8594