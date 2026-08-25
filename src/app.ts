// // import express from 'express';
// // import indicatorRoutes from './routes/indicator.routes';
// // import alertRoutes from './routes/alert.routes';

// // const app = express();

// // app.use(express.json());

// // app.use('/api/indicators', indicatorRoutes);
// // app.use('/api/alerts', alertRoutes);

// // export default app;

// import express from 'express';
// import cors from 'cors';
// import indicatorRoutes from './routes/indicator.routes';
// import alertRoutes from './routes/alert.routes';

// const app = express();

// app.use(cors()); // necesario para que el frontend (otro puerto) pueda llamar a la API
// app.use(express.json());

// app.use('/api/indicators', indicatorRoutes);
// app.use('/api/alerts', alertRoutes);

// export default app;


// import express from 'express';
// import cors from 'cors';
// import indicatorRoutes from './routes/indicator.routes';
// import alertRoutes from './routes/alert.routes';
// import geoLocationRoutes from './routes/geo-location.routes';

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/indicators', indicatorRoutes);
// app.use('/api/alerts', alertRoutes);
// app.use('/api/geo-locations', geoLocationRoutes);

// export default app;
// commit 1


// prueba 1 desde bruno
import express from 'express';
import cors from 'cors';
import indicatorRoutes from './routes/indicator.routes';
import alertRoutes from './routes/alert.routes';
import geoLocationRoutes from './routes/geo-location.routes';
import logicalLocationRoutes from './routes/logical-location.routes';

const app = express();

app.disable('etag');
app.use(cors());
app.use(express.json());

app.use('/api/indicators', indicatorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/geo-locations', geoLocationRoutes);
app.use('/api/logical-locations', logicalLocationRoutes);

export default app;