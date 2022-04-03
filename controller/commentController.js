import Comment from '../model/comment.js'

class CommentController {
    getAll = async (_req, res) => {
        try {
            const comments = await Comment.find();
            return res.json(comments);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    getComment = async (req, res) => {
        try {
            const comment = await Comment.findOne({_id: req.params.id});
            if(!comment) {
                return res.status(404).send();
            }
            return res.json(comment);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    createComment = async (req, res) => {   
        try{
            const comment = new Comment({
                content: req.body.content,
                from: req.username // get from token!!!
            })
    
            await comment.save();
            return res.json(comment).status(201);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    deleteComment = async (req, res) => { 
        try{
            const comment = await Comment.findOne({id: req.params.id});
            if(!comment) {
                return res.status(404).json({message: "Comment not found"});
            }
            await Comment.deleteOne({_id: req.params.id});
            return res.status(204).send();
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    editComment = async(req, res) => {
        try{
            const comment = await Comment.findOne({id: req.params.id});

            if(!comment) {
                return res.status(404).json({message: "Comment not found"});
            }

            await Comment.findOneAndUpdate({ '_id': comment._id }, { content: req.body.content });
            return res.send();
        } catch(err) {
            return res.json({message: err}).status(500);
        }  
    }
}

export default CommentController;
