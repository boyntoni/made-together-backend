const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { jwtConfig } = require('../utils');
const { Account } = require('../schema');

router.post('/create-account', (req, res, next) => {
  debugger
    let account = new Account(req.body.account);
    account.save(function(err, accountData) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Unable to save account'
            });
        }
        let token = jwt.sign({ username: accountData.username }, jwtConfig.secretOrKey);
        return res.json({ success: true, accountData, token });
    });
})

module.exports = router
