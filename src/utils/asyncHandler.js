//M1: Promise
// const asyncHandler = (requestHandler) => {
//     (req, res, next) = Promise.resolve(requestHandler(req, res, next)).
//     catch((err)=> next(err))
// }

//M2: async-await
const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next)        
    } catch (error) {
        res.status(err.code || 400).json({
            success: false,
            message: err.message
        })
    }
}

export {asyncHandler}