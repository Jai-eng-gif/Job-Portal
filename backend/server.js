import express from 'express'
import bodyParser from 'body-parser'    
import cors from 'cors'
import db from './config/db.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
app.use(bodyParser.json()) 
app.use(cors());

const port = 3000


// All Route 
app.use('/api/auth', authRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})