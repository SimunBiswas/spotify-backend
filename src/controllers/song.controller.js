import { Song } from "../models/songs.model.js"

export const getAllSongs = async (req, res, next) => {
    try{
        // -1 = Descending => newest -> oldest
        // 1 = Ascending => oldest -> newest

        const songs = await Song.find().sort({ createdAt: -1 })
        // .populate('user', 'firstName lastName').populate('album', 'title cover').exec();
        res.json(songs)
    }
    catch(error){
        next(error)
    }
}

export const getFeaturedSongs = async (req, res, next) => {
    try{
        // fetch 6 random songs using mongodb agregate timeline
        const songs = await Song.aggregate([
            { $sample: { size: 6 } },
            { $project: { _id : 1, title : 1, artist : 1, imageUrl : 1, audioUrl : 1} }
        ])
        res.json(songs);
    }catch(error){
        next(error)
    }
}

export const getMadeForYouSongs = async (req, res, next) => {
    try{
        // fetch 6 random songs using mongodb agregate timeline
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            { $project: { _id : 1, title : 1, artist : 1, imageUrl : 1, audioUrl : 1} }
        ])
        res.json(songs);
    }catch(error){
        next(error)
    }
}

export const getTrendingSongs = async (req, res, next) => {
    try{
        // fetch 6 random songs using mongodb agregate timeline
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            { $project: { _id : 1, title : 1, artist : 1, imageUrl : 1, audioUrl : 1} }
        ])
        res.json(songs);
    }catch(error){
        next(error)
    }
}