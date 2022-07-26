const express = require("express");
const five = require("johnny-five");
const bodyParser = require('body-parser');

const JsonParser = bodyParser.json();

const Config = require("./config");
const EnumHelper = require("./utils/enum_helper");
const MessageHelper = require("./utils/message_helper");
const ResponseHelper = require("./utils/response_helper");

const board = new five.Board({port: Config.hardwarePort});

board.on("ready", () => {

    const app = express();

    const led = new five.Led(11);
    const servo = new five.Servo(10);

    app.post("/hardware/execute", JsonParser, (req, res) => {
        try {
            let data = req.body;
            let commandContent = data.command_content;
            if (commandContent.device.toUpperCase() === "LED") {
                let brightness = Math.abs(commandContent.brightness) % 256;
                led.brightness(brightness);
                console.log(`LED brightness set to ${brightness}`);
            }
            if (commandContent.device.toUpperCase() === "SERVO") {

            }
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({message: MessageHelper.device_execute_successful}));
        } catch (err) {
            console.log(err);
            res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({message: MessageHelper.device_execute_failed}));
        }

    });

    // blink signals ready
    led.blink(500);
    setTimeout(() => {
        led.stop().off();

        // start command listening
        app.listen(Config.port);
    }, 2000);

    board.on("exit", () => {
        led.stop().off();
        servo.stop();
    });

});
