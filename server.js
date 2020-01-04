// Simple Express tutorial: https://www.robinwieruch.de/node-express-server-rest-api
// Additionally used: nodemon as filechange monitor, swagger-ui-express for the api documentation

'use strict';
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    emitterPin = process.env.EMITTER_PIN || 7,
    rpi433 = require("rpi-433-v2"),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    swaggerOptions = {
        explorer: false
    },
    fs = require('fs'),
    deviceConfigurationFile = 'device_configuration.json';

app.listen(port);
console.log(`API Server started on port ${port}.`);
console.log('API Docs are located at /api-docs and /swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.set('x-powered-by', false);
app.set('json spaces', 2);

app.use((request, response, next) => {
    console.log("Requested path: " + request.path);
    next();
});


app.post('/emit/:value/:length/:delay', (request, response) => {
    const value = request.params.value;
    const delay = request.params.delay;
    const length = request.params.length;

    const rfEmitter = rpi433.emitter({
        pin: emitterPin,
        pulseLength: length,
        protocol: delay
    });

    rfEmitter.sendCode(value, function (error, stdout) {
        console.log(`Sending code ${value}...`);
        console.log(stdout);
    });
    const responseMessage = `Successfully emitted value/length/delay: ${value}/${length}/${delay}`;
    console.log("Response message: " + responseMessage);
    return response.send(responseMessage);
});

app.get('/devices', (request, response, next) => {
    const rawdata = fs.readFileSync(deviceConfigurationFile);
    const configuration = JSON.parse(rawdata);
    response.json(configuration);
    next();
});