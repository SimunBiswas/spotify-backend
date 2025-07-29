import { Album } from "../models/album.model.js";
import { Song } from "../models/songs.model.js";
import cloudinary from '../lib/cloudinary.js';

// helper function to cloudinary file upload
const uploadToCloudinary = async (file) => {
   try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
         resource_type: "auto",
      });
      return result.secure_url; // return the uploaded file URL
   } catch (error) {
      console.log("Cloudinary upload failed:", error);
      throw new Error("Cloudinary upload failed");
   }
};



export const createSong = async (req, res, next) => {
	try {
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, artist, albumId, duration } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		// if song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};



export const deleteSong = async (req, res, next) => {
    try {
        
        const { id }  = req.params;
        const song = await Song.findById(id);
        

        //if song belongs to an album, remove the song from the album's song array
        if(!song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull : { songs : song._id }
            })
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message : "Song deleted successfully" });
        console.log("deleted Song successfully")
    }
    catch(error){
        next(error);
    }
}

export const createAlbum = async (req, res, next) => {
    try{
        const {title, artist, releaseYear} = req.body;

        const {imageFile} = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });

        await album.save();
        res.status(201).json(album);
    }
    catch(error) {
        console.log("Error creating album", error);
        next(error);
    }

}
export const deleteAlbum = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id);
        const song = await Song.find({ albumId: req.params.id });
        const { id } = req.params;

        await Song.deleteMany({albumId : id});
        await Album.findByIdAndDelete(id);

        // delete all songs in the album
        await Song.deleteMany({ _id: { $in: album.songs } });

        await Album.findByIdAndDelete(id);

        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin : true });
}
