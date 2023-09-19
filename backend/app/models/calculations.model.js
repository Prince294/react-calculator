module.exports = (sequelize, Sequelize) => {

    const Calculation = sequelize.define("calculation", {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        calculation_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        calculation_string: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Calculation;
};