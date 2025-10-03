
const notFound = (req, res, next) => {
    res.status(404)
    const err = new Error(`Not found: ${req.origianlUrl}`)
    next(err)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

export { notFound, errorHandler }