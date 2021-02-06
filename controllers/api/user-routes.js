const router = require('express').Router();
const session = require('express-session');
const { Module } = require('module');
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    }).then(dbUserData => {
        return res.json(dbUserData)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with that id exists.' })
        }
        return res.json(dbUserData);
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with that email address exists! '});
        }

        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Incorrect password! '});
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            console.log("Session HJere:",req.session.loggedIn);
            res.json({ user: dbUserData, message: 'You are now logged in!' })
        });
    });
});

router.post('/logout', (req, res) => {
    console.log("Session HJere:",req.session.loggedIn);
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
})

router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with that id exists.' })
        }
        return res.json(dbUserData);
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    })
});

router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with that id exists.' })
        }
        return res.json(dbUserData);
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

module.exports = router; 