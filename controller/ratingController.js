import Rating from '../model/rating.js'
import Book from '../model/books.js'

class RatingController {
    getAll = async (req, res) => {
        const bookIsbn = req.query.book

        try {
            if(bookIsbn) {
                const rating = await Rating.findOne({referenceBookIsbn: bookIsbn})
                return res.json(rating);
            }

            const ratings = await Rating.find();
            return res.json({ratings: ratings});
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    getRating = async (req, res) => {
        try {
            const rating = await Rating.findOne({_id: req.params.id});
            if(!rating) {
                return res.status(404).send();
            }
            return res.json(rating);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    updateRating = async (req, res) => {   
        try{
            let rating = await Rating.findOne({_id: req.params.id});
            if(!rating) {
                return res.status(404).send();
            }
            const stars = req.body.stars
            if(stars < 1 || stars > 5) {
                return res.status(404).send();
            }

            const totalRating = (rating.oneStar*1 + rating.twoStar*2 + rating.threeStar*3 + rating.fourStar*4 + rating.fiveStar*5 + stars) / (rating.oneStar + rating.twoStar + rating.threeStar + rating.fourStar + rating.fiveStar + 1)

            if(stars === 1) {
                rating.oneStar++;
            } else if(stars === 2) {
                rating.twoStar++;
            }
            else if(stars === 3) {
                rating.threeStar++;
            }
            else if(stars === 4) {
                rating.fourStar++;
            }
            else if(stars === 5) {
                rating.fiveStar++;
            }
            
            rating.total = totalRating;

            if(!rating.voters) {
                rating.voters = [req.email];
            } else {
                rating.voters = [...rating.voters, req.email];
            }

            await Book.findOneAndUpdate({'isbn': rating.referenceBookIsbn}, {rating: totalRating});
            await rating.save();
            return res.json(rating).status(200);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }
}

export default RatingController;
