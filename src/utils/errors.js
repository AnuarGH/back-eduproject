let httpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

module.exports = {
    notFound: httpError(404, "Not Found"),
    unauthorized: httpError(401, "Unauthorized"),
    unauthorizedForCourse: httpError(401, "Unauthorized for this course"),
    emailExists: httpError(401, "Email already registered"),
    usernameExists: httpError(401, "Username already registered"),
    serviceNotAvailable: httpError(503, "Service Not Available"),
    imageUploadFailed: httpError(500, "Image Upload Failed"),
    badRequest: httpError(400, "Bad request"),
    paymentNotFound: httpError(401, "You are not allowed to take this course")
};
