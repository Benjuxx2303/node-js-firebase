import express from 'express';
import cors from 'cors';

import productRoute from './routes/productRoute.js';
import config from './config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use('/api', productRoute);


/**
 * This method is a JavaScript arrow function that logs a message indicating that
 * the server is live. The message includes the host URL from the `config` object.
 */
app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);