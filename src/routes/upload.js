let path = require('path');
let router = require('express').Router();
let formidable = require('formidable');
let fs = require('fs');
let errors = require("../utils/errors");

router.post('/course_logo', function(req, res, next){
    // create an incoming form object
    let form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../client/assets/images/course_logos');
    console.log("[routes/upload] Upload directory: ", form.uploadDir);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        console.log("[routes/upload] File uploaded!");
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        return next(errors.imageUploadFailed);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

module.exports = router;