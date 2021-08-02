const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const Bitcoin = require('bitcoin-address-generator');
const balance = require('crypto-balances');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const CoinKey = require('coinkey');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      var wallet = new CoinKey.createRandom();
      let bitAdd = wallet.publicAddress;
      let bitKey = wallet.privateKey.toString('hex');

      let bitcoinAddress = {};
      Bitcoin.createWalletAddress((data) => {
        bitcoinAddress = data;
      });

      let bitcoinBalance = {};
      balance(bitcoinAddress, function (error, result) {
        console.log(result);
      });

      // console.log('this is a test');
      let bitcoinQr = {};
      QRCode.toString(
        bitcoinAddress,
        { type: 'terminal' },
        function (err, url) {
          bitcoinQr = url;
        }
      );

      // console.log(bitcoinQr);

      user = new User({
        name,
        email,
        avatar,
        bitAdd,
        bitKey,
        bitcoinAddress,
        bitcoinBalance,
        bitcoinQr,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
