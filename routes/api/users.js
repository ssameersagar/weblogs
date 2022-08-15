const express   = require('express');
const router    = express.Router();
const gravatar  = require('gravatar');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('config');

const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// POST api/users
// Register User
// Public
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more Characters').isLength({ min: 6 })
] ,
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;
    try {

        let user = await User.findOne({ email });

        //See if user exists
        if(user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists'}] });
        }

        //Get its gravatar
        // const avatar = gravatar.url(email,{
        //     s:'200',
        //     r: 'pg',
        //     d: 'mm'
        // });
        const avatar = gravatar.url(email, {
              s: '200',
              r: 'pg',
              d: 'mm'
            });

        user = new User({
            name,email,password,avatar
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return jsonwebtoken

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token })
            }
        );

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');


    }

    


});

module.exports = router;