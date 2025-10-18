import dotenv from 'dotenv'
import express, { Request, Response, NextFunction} from 'express'
import { router as usersRoute} from './src/routes/users'
import { router as servicesRoute} from './src/routes/services'
import { router as reservesRoute} from './src/routes/reserves'

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(express.json())

app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).send({ msg: 'Raiz do Projecto'})
})

app.use('/api/v1/users', usersRoute)
app.use('/api/v1/services', servicesRoute)
app.use('/api/v1/reserves', reservesRoute)

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Rota não encontrada') as any
  err.status = 404
  next(err)
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ msg: err.message})
})

app.listen(port, () => {
  console.log('Servidor ligado')
})

