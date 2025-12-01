import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './server/http/routes';

const app = express();

// Middlewares
app.use(cors({ origin: "*" })); // Permitir todo para desarrollo
app.use(bodyParser.json());

// Montar rutas
app.use('/api', apiRoutes);

// Ruta base para verificar que vive
app.get('/', (req, res) => {
    res.send('Code Colony Server is Running');
});

export default app;