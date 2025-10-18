import dotenv from 'dotenv'
import express from 'express'
const port = process.env.SERVER_PORT || 3000

dotenv.config()
const app = express()

app.use(express.json())

app.get('/api/v1', (req, res, next) => {
    res.status(200).send({msg: 'Raiz do Projecto'})
})

import {router} from './src/routes/users.js'
app.use('/api/v1/users', router)


app.use((req, res, next) => {
    const err = new Error('Rota não encontrada')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({msg: err.message})
})

app.listen(port, () => {
    console.log('Servidor ligado');
    
})