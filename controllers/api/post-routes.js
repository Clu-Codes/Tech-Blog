const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req ,res) => {
    Post.findAll({
        attributes: ['id', 'post_content', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at']
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        res.json(dbPostData);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at']
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if (!dbPostData) {
            return res.status(404).json({ message: 'No post with that id was found!' });
        }
        return res.json(dbPostData);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    }).then(dbPostData => {
        res.json(dbPostData);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_content: req.body.comment
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(dbPostData => {
        if (!dbPostData) {
            return res.status(404).json({ message: 'No post with that id was found!' })
        }
        console.log('===========', dbPostData)
        return res.json(dbPostData)
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post with that id was found!' })
        }
        return res.json(dbPostData);
    }).catch(err => {
        console.log(err)
        return res.status(500).json(err);
    });
});

module.exports = router;