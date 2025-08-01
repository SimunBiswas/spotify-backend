import { Album } from "../models/album.model.js"
import { Song } from "../models/songs.model.js"
import { User } from "../models/user.model.js"

export const getStats = async (req, res, next) => {
    try{
        // const totalSongs = await Song.countDocuments()
        // const totalUsers = await User.countDocuments()
        // const totalAlbums = await Album.countDocuments()

        const [totalSongs, totalUsers, totalAlbums, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),
            Song.aggregate([
                {
                    $unionWith : {
                        coll : 'albums',
                        pipeline : []
                    }
                },
                {
                    $group : {
                        _id : '$artist',
                    }
                },
                {
                    $count : 'count'
                }
            ])

        ])

        // console.log(totalArtists)
        
        res.status(200).json({
            totalSongs,
            totalUsers,
            totalAlbums,
            totalArtists : uniqueArtists[0]?.count || 0
        })
    }
    catch(error){
        console.log('error of stats')
        next(error)
    }
}