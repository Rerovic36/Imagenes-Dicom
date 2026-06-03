import express from 'express';
import imagenesRoutes from './routes/imagenes.routes.js';
import cors from 'cors';

const app = express()

app.use(express.json());
app.use(cors());
const port = 7000
app.use(imagenesRoutes)

app.listen(port, () => console.log(`Server running on port ${port}! ${process.env.host_db}`))
