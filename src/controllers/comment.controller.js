import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params

    if(!content || !content.trim() || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoID or Content is Required")
    }

    const isExist = await Video.exists({_id: videoId})

    if (!isExist) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment is created"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

    if(!content || !content.trim()){
        throw new ApiError(400, "Content can't be empty")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId")
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    )

    if (!comment) {
        throw new ApiError(404, "Comment does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId")
    }

    const isExist = await Comment.exists({_id: commentId})

    if (!isExist) {
        throw new ApiError(404, "Comment not exists")
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }