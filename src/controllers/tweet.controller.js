import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content can't be empty")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(201, tweet, "Tweet Created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetId} = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid TweetID")
    }

    if(!content || !content.trim()){
        throw new ApiError(400, "Content cna't be empty")
    }

    const tweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user._id
        },
        {
            $set: {
                content: content.trim(),
            }
        },
        {
            new: true
        }
    )

    if (!tweet) {
        throw new ApiError(400, "Tweet not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, ("Invalid TweetID"))
    }

    const tweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner: req.user._id
        }
    )

    if (!tweet) {
        throw new ApiError(400, "Tweet not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}