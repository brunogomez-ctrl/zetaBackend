import express from 'express';
import cors from 'cors';
import indicatorRoutes from './routes/indicator.routes';
import alertRoutes from './routes/alert.routes';
import geoLocationRoutes from './routes/geo-location.routes';
import logicalLocationRoutes from './routes/logical-location.routes';

const app = express();

app.disable('etag'); // evita que el navegador cachee respuestas GET
app.use(cors());
app.use(express.json());

app.use('/api/indicators', indicatorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/geo-locations', geoLocationRoutes);
app.use('/api/logical-locations', logicalLocationRoutes);

export default app;
