const User = require('../models/user.model');
const Sponsor = require('../models/sponsor.model');
const Expert = require('../models/expert.model');
const {
    validationResult
} = require('express-validator');
const AuthMessages = require("../messages/auth.messages");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/config");

exports.getInfo = (req, res) => {
    let message = AuthMessages.success.s1;
    message.body = req.user;
    return res.status(message.http).send(message);
}

function auth(entity, password, req, res) {
    if (!bcrypt.compareSync(password, entity.auth.password))
        return res.header("Authorization", null).status(AuthMessages.error.e0.http).send(AuthMessages.error.e0);

    let payload = {
        pk: entity.auth.public_key
    }

    let options = {
        expiresIn: CONFIG.auth.expiration_time, issuer: CONFIG.auth.issuer
    };

    let token = JWT.sign(payload, entity.auth.private_key, options);

    let message = AuthMessages.success.s0;
    message.body = entity;
    return res.header("Authorization", token).status(message.http).send(message);
}

exports.login = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    let username = req.body.username;
    let password = escape(req.body.password);

    User.findOne({
            "auth.username": username
        }, (error, user) => {
            if (error) throw error;

            if (user) {
                return auth(user, password, req, res);
            } else {
                Sponsor.findOne({"auth.username": username}, (err, sponsor) => {
                        if (error) throw error;

                        if (sponsor) {
                            return auth(sponsor, password, req, res);
                        } else {
                            Expert.findOne({"auth.username": username}, (err, expert) => {
                                if (error) throw error;

                                if (expert) return auth(expert, password, req, res);

                                return res.header("Authorization", null).status(AuthMessages.error.e0.http).send(AuthMessages.error.e0);
                            });
                        }
                    }
                )
                ;
            }
        }
    )
    ;
}

exports.checkAuth = (req, res, callback) => {
    // return callback();
    let token = req.headers.authorization;
    if (!token) return res.status(AuthMessages.error.e1.http).send(AuthMessages.error.e1);

    let payload = JWT.decode(token);

    User.findOne({
        "auth.public_key": payload.pk
    }, (error, user) => {
        if (error) throw error;
        if (user) {

            JWT.verify(token, user.auth.private_key, (error) => {
                if (error) return res.status(AuthMessages.error.e1.http).send(AuthMessages.error.e1);

                req.user = user;
                return callback();

            });
        } else {
            Sponsor.findOne({
                "auth.public_key": payload.pk
            }, (error, sponsor) => {
                if (error) throw error;
                if (sponsor) {

                    JWT.verify(token, sponsor.auth.private_key, (error) => {
                        if (error) return res.status(AuthMessages.error.e1.http).send(AuthMessages.error.e1);

                        req.user = sponsor;
                        return callback();

                    });
                } else {
                    Expert.findOne({
                        "auth.public_key": payload.pk
                    }, (error, expert) => {
                        if (error) throw error;
                        if (expert) {

                            JWT.verify(token, expert.auth.private_key, (error) => {
                                if (error) return res.status(AuthMessages.error.e1.http).send(AuthMessages.error.e1);

                                req.user = expert;
                                return callback();

                            });
                        } else {
                            return res.status(AuthMessages.error.e1.http).send(AuthMessages.error.e1);
                        }
                    });
                }

            });
        }
    });
}
