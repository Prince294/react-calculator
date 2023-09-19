module.exports = (app) => {
    const db = require("./models");
    const user_router = require("express").Router();
    const user_controller = require("./controllers/user.controller");

    const { authJwt } = require("./middleware");

    user_router.post("/save_data", [authJwt.verifyToken], user_controller.save_data);

    user_router.get("/create_user", user_controller.createUser);

    user_router.get("/show_calculation", user_controller.showCalculation);

    user_router.post("/delete_calculation", user_controller.deleteCalculation);


    app.use("/api/", user_router);
}