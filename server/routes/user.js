let express = require('express');
let router = express.Router();

router.get("/test", (req, res, next) => {
    res.send({
        code: 200,
        message: "okay"
    });
});

module.exports = router;