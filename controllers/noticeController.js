

exports.getCurrentTime = (req, res, next) => {

    let time = new Date().toString();
    res.status(200).json({currentTime:time});

};