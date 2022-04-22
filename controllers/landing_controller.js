const { body, validationResult } = require("express-validator");

function getRandomUserName() {
    const fs = require('fs');

    const animals = fs.readFileSync('data/animals.txt', 'utf-8').split(/\r?\n/);
    const animal = animals[Math.floor(Math.random() * animals.length)];

    const adjectives = fs.readFileSync('data/english-adjectives.txt', 'utf-8').split(/\r?\n/);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    return adjective + ' ' + animal;
}

exports.username_get = function (req, res, next) {
    res.render('landing', { title: 'Multiplayer WorNDle', randomUserName: getRandomUserName() });
}

exports.username_post = [

    // Validate and sanitize the name field.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Username required!')
        .matches(/^[a-zA-Z0-9 ]+$/i).withMessage('Username has non-alphanumeric characters.'),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var username = req.body.username;

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('landing', { title: 'Multiplayer WorNDle', randomUserName: getRandomUserName() , errors: errors.array() });
            return;
        }
        res.redirect('/lobby');
    }
];