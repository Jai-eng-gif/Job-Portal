import express from 'express'
import bodyParser from 'body-parser'    
import cors from 'cors'
import db from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import dashboardRoutes from './routes/dashboardRoute.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json()) 
app.use(cors());

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// All Route 
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})