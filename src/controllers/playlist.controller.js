import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "Name or Description can't be empty")
    }

    const playlist = await Playlist.create(
        {
            name: name.trim(),
            description: description.trim(),
            owner: req.user._id,
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist is Created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid UserId")
    }

    const playlist = await Playlist.find({owner: userId})

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "User Playlist"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist found"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid PlaylistId or VideoId")
    }

    const video = await Video.exists({_id: videoId})

    if (!video) {
        throw new ApiError(404, "Video does not exists")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $addToSet: {
                video: videoId
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!playlist){
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video Added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid PlaylistId or VideoId")
    }

    const video = await Video.exists({_id: videoId})

    if (!video) {
        throw new ApiError(404, "Video does not Exists")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $pull: {
                video: videoId
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid PlaylistId")
    }

    const playlist = await Playlist.findOneAndDelete(
        {
            _id: playlistId,
            owner: req.user._id
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId")
    }

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "Name or Description can't be empty")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id

        },
        {
            $set: {
                name: name.trim(),
                description: description.trim()
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Updated"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}