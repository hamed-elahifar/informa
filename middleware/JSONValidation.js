
module.exports = function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).send('JSON validation failed. Bad Request')
    } else {
      return next();
    }
}