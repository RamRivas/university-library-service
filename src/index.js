const express = require('express');
const { CTX, PORT, URI } = require('./config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes');

const main = async () => {
    try {
        const app = express();
        app.use(express.json());

        //Middlewares
        for (const router in routes) {
            app.use('/api', routes[router]);
        }

        //Routes
        app.get('/ping', (_req, res) => {
            console.log('Someone pinged here');
            res.send('pong');
        });

        //Mongodb connection
        await mongoose.connect(URI);

        //Morgan
        CTX === 'dev' && app.use(morgan('dev'));

        app.listen(PORT, console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.log(
            `Cannot start the server due the following error ${error.message}`
        );
    }
};

main();
