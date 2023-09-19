const db = require("../models");
const User = db.user;
const Calculation = db.calculation;
var jwt = require("jsonwebtoken");


exports.createUser = (req, res) => {
    var date = new Date();
    var token = jwt.sign({ id: date.getTime }, "SecretCode");
    if (!token) {
        res
            .status(400)
            .send({ message: "Error occur while generating token!" });
        return;
    }
    let body = {
        encryptedKey: token
    }
    User.create(body).then(userCreated => {
        res.status(200).send({
            user_token: token,
        });
    }).catch(err => {
        res.status(404).send({
            message: "Something Went Wrong!"
        });
    })
}

exports.save_data = (req, res) => {
    const calculation_id = req?.body?.calculation_id;
    const calculation_string = req?.body?.calculation_string;
    const calculation_name = req?.body?.calculation_name;

    if (calculation_id) {
        updateCalculation(calculation_id, calculation_string).then(response => {
            res.status(200).send({ message: "Success" })
        }).catch(err => {
            res.status(404).send({ message: "Failed" })
        })
    }
    else {
        createCalculation(calculation_string, res.locals.user_id, calculation_name).then(response => {
            res.status(200).send({ message: 'Success', id: response?.id })
        }).catch(err => {
            res.status(400).send({ message: 'Failed' })
        })
    }
}

exports.showCalculation = (req, res) => {
    Calculation.findAll({ user_id: res.locals.user_id }).then(calc => {
        res.status(200).send({ message: "Success", data: calc })
    }).catch(err => {
        res.status(400).send({ message: 'Failed' })
    })
}


exports.deleteCalculation = (req, res) => {
    Calculation.destroy({ where: { id: req?.body?.id } }).then(response => {
        res.status(200).send({ message: "Success" })
    }).catch(err => {
        // console.log(err)
        res.status(400).send({ message: 'Failed' })
    })
}

const updateCalculation = (calculation_id, calculation_string) => {
    return new Promise((resolve, reject) => {
        Calculation.findOne({ where: { id: calculation_id } }).then(result => {
            if (result) {
                Calculation.update({ calculation_string: calculation_string }, { where: { id: calculation_id } }).then(updateRes => {
                    resolve({ message: "Success" })
                }).catch(err => {
                    // console.log(err)
                    reject({ message: "Failed" })
                })
            }
            else {
                reject({ message: "Wrong Calculation Id" })
            }
        }).catch(err => {
            reject({ message: "Wrong Calculation Id" })
        })
    })
}

const createCalculation = (calculation_string, user_id, calculation_name) => {
    return new Promise((resolve, reject) => {
        Calculation.create({ calculation_string: calculation_string, user_id: user_id, calculation_name: calculation_name }).then(createRes => {
            resolve({ id: createRes?.id })
        }).catch(err => {
            reject({ message: "Failed" })
        })
    })

}