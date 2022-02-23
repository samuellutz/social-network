const {
    Thought,
    User
} = require('../models');
const thoughtController = {

    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})

        .select('-__v')
        .sort({
            _id: -1
        })
        .then(dbThoughtData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //get one thought by id
    getThoughtsById({
        params
    }, res) {
        Thought.findOne({
                _id: params.thoughtsid
            })
            .select('-__v')
           .sort({
                _id: -1
            })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No thought found with id.'
                    });
                    return;
                }
                res.json(dbThoughtsData)
            })
            .catch(err => {
                console.log(err);
                res.Status(400).json(err);
            });
    },

    //create thought
    createThoughts({
        body
    }, res) {
        Thought.create(body)
            .then((ThoughtsData) => {
                return User.findOneAndUpdate({
                        _id: body.userId
                    }, 
                    {
                        $addToS: {thoughts: ThoughtsData._id}
                    }, 
                    {new: true});
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
    },

    //update thought by id
    updateThoughts({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, body, {
                new: true,
                runValidation: true
            })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No thought found with this id.'
                    });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete thought
    deleteThoughts({
        params
    }, res) {
        Thought.findOneAndDelete({
                _id: params.thoughtId
            })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    return res.status(404).json({
                        message: 'No thought found this id.'
                    });
                }
                return User.findOneAndUpdate({
                    username: dbThoughtsData.username
                }, 
                {
                    $pull: {thoughts: params.thoughtId}
                }, 
                {new: true})
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with that id.'
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.status(400).json(err));
    },

    //create reactions
    createReactions({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, 
            {
                $addToSet: {reactions: body}
            }, 
            {new: true})
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.json(err));
    },

    //delete reaction
    deleteReactions({
        params
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $pull: {
                    reactions: {
                        reactionId: params.reactionId
                    }
                }
            }, {
                new: true
            })
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
}

module.exports = thoughtController;  