const express = require("express");
var app = express();
const cors = require("cors");
const db = require("./app/models");
require("dotenv").config("./.env");
const PORT = process.env.PORT;
const bearerToken = require("express-bearer-token");

db.sequelize.sync({ force: false }).then(() => {
    // console.log("re-sync db.");
});

var corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(express.json());

app.use(
    bearerToken({
        headerKey: "Basic",
    })
);

require("./app/api.routes")(app);

app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
