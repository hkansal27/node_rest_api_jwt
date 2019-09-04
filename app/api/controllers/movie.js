const movieModel = require('../models/movie');

module.exports = {
    getAll: (req, res, next) => {
        movieModel.find({}, (err, result) => {
            if (err)
                next(err);
            else {
                let movieList = [];
                if (Array.isArray(result) && result.length > 0) {
                    for (item of result) {
                        movieList.push({ id: item._id, name: item.name, releaseDate: item.released_on });
                    }
                    res.json({
                        'status': 'Success',
                        'data     ': movieList
                    })
                } else {
                    res.json({ 'message': "No Movie found!!" })
                }
            }
        })
    },
    getById: (req, res, next) => {
        const movieId = req.params.movieId;
        movieModel.findById(movieId, (err, result) => {
            if (err)
                next(err);
            else {
                res.json({ message: 'Success', data: { movie: result } })
            }
        })
    },
    updateById: (req, res, next) => {
        movieModel.findByIdAndUpdate(req.params.movieId, { name: req.body.name }, (err, result) => {
            if (err)
                next(err)
            else {
                res.json({message: 'success'})
            }
        })
    },
    deleteById: (req, res, next) => {
        movieModel.findByIdAndDelete(req.params.movieId, (err, result) => {
            if(err)
                next(err);
            else {
                res.json({message: "Success", data: null})
            }
        })
    },
    create: (req, res, next) => {
        movieModel.create({name: req.body.name, released_on: req.body.releaseDate}, (err, result) => {
            if(err)
                next(err);
            else {
                res.json({message: 'Success!', data: result})
            }
        })
    }
}