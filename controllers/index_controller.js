const { body, validationResult } = require("express-validator");

exports.username_get = function (req, res, next) {
    res.render('index', { title: 'Multiplayer WorNDle' });
}

exports.username_post = [

    // Validate and sanitize the name field.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Username required!')
        .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var username = req.body.username;

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('index', { title: 'Multiplayer WorNDle', errors: errors.array() });
            return;
        }
        res.render('lobby', { title: 'Game Lobby' , username: username});
    }
];