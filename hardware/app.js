const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const JsonParser = bodyParser.json();
const five = require("johnny-five");

const Config = require("./config");
const EnumHelper = require("./utils/enum_helper");
const MessageHelper = require("./utils/message_helper");
const ResponseHelper = require("./utils/response_helper");

const board = new five.Board(Config.hardwarePort);

board.on("ready", () => {

    const led = new five.Led(11);
    const servo = new five.Servo(10);

    app.post("/hardware/execute", JsonParser, (req, res) => {
        try {
            let data = req.body;
            let commandContent = data.command_content;
            if (commandContent.device === "LED") {
                console.log(Math.abs(commandContent.brightness) % 256);
                led.brightness(Math.abs(commandContent.brightness) % 256);
            }
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({message: MessageHelper.device_execute_successful}));
        } catch (err) {
            console.log(err);
            res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({message: MessageHelper.device_execute_failed}));
        }

    });

    app.listen(Config.port);

});
