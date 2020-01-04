// Simple Express tutorial: https://www.robinwieruch.de/node-express-server-rest-api
// Additionally used: nodemon as filechange monitor, swagger-ui-express for the api documentation

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    emitterPin = process.env.EMITTER_PIN || 7,
    rpi433 = require("rpi-433-v2"),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    swaggerOptions = {
        explorer: false
    };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.listen(port);

console.log(`API Server started on port ${port}.`);
console.log('API Docs are at /api-docs and /swagger');

app.post('/emit/:value/:length/:delay', (req, res, next) => {
    const value = req.params.value;
    const delay = req.params.delay;
    const length = req.params.length;
    
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
    return res.send(JSON.stringify(responseMessage));
});