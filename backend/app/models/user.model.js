module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("user", {
        encryptedKey: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return User;
};