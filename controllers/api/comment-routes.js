const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', (req, res) => {
    Comment.findAll({
        comment_text: req.body.comment_text
    }).then(dbCommentData => {
        res.json(dbCommentData);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.body.user_id
    }).then(dbCommentData => {
        res.json(dbCommentData);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        res.json(dbCommentData);
    }).catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;
