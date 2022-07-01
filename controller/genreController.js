import Genre from '../model/genre.js'

class GenreController {
    getAll = async (_req, res) => {
        try {
            const genres = await Genre.find();
            return res.json({genres:genres});
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    getGenre = async (req, res) => {
        try {
            const genre = await Genre.findOne({name: req.params.name});
            if(!genre) {
                return res.status(404).send();
            }
            return res.json(genre);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    createGenre = async (req, res) => {   
        try{
            let genre = await Genre.findOne({name: req.body.name});
            if(genre) {
                return res.status(409).send();
            }
    
            genre = new Genre({
                name: req.body.name,
            })
    
            await genre.save();
            return res.json(genre).status(201);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    deleteGenre = async (req, res) => { 
        try{
            const genre = await Genre.findOne({name: req.params.name});
            if(!genre) {
                return res.status(404).json({message: "Genre not found"});
            }
            await Genre.deleteOne({name: req.params.name});
            return res.status(204).send();
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }
}

export default GenreController;
