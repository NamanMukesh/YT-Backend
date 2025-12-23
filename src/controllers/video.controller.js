import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title or Description can't be empty")
    }

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video?.url || !thumbnail?.url) {
        throw new ApiError(500, "Video or Thumbnail Upload Failed")
    }

    const uploadedVideo = await Video.create(
        {
            title: title.trim(),
            description: description.trim(),
            duration: video.duration || 0,
            videoFile: {
                url: video.url,
                public_id: video.public_id
            },
            thumbnail: {
                url: thumbnail.url,
                public_id: thumbnail.public_id
            },
            owner: req.user._id,
            isPublished: false
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video uploaded successfully")); 
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Found"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const {title, description} = req.body

    const thumbnailLocalPath = req.file?.path

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoId")
    }

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title or Description can't be empty")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is Missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail?.url) {
        throw new ApiError(400, "Thumbnail Upload Failed")
    }

    const video = await Video.findOneAndUpdate(
        {
            _id: videoId,
            owner: req.user._id
        },
        {
            $set: {
                title: title.trim(),
                description: description.trim(),
                thumbnail: thumbnail.url
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!video){
        throw new ApiError(404, "Video does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const video = await Video.findOneAndDelete(
        {
            _id: videoId,
            owner: req.user._id
        }
    )
    
    if(!video){
        throw new ApiError(404, "Video does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoId")
    }

    const video = await Video.findOneAndUpdate(
        {
            _id: videoId,
            owner: req.user._id
        },
        [
            {
                $set: {
                    isPublished: {$not: "$isPublished"}
                }
            }
        ],
        {
            new: true,
            runValidators: true
        }
    )

    if (!video) {
        throw new ApiError(404, "Video does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {isPublished: video.isPublished}, 
        video.isPublished ? "Video Published" : "Video Unpublished"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}