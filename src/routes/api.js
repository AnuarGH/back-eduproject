const errors = require("../utils/errors");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const {USER, ADMIN} = require('../utils/passport');


const Course = require('../models/Course');

router.get('/', function(req, res){
    res.send("API v1.0.0");
});


// Only for those who bought the course [NO PAYMENTS YET]
router.post('/enroll/:course_id', USER, asyncHandler(async (req, res, next) => {
    // if (!req.user.payments.find((payment)=> payment.course_id === this.params.course_id)){
    //     next(errors.paymentNotFound);
    // }
    console.log(req.user);
    try {
        if (!req.user.enrolled_courses.find(item=>item===req.params.course_id)) {
            req.user.enrolled_courses.push(req.params.course_id);
            req.user.save();
        }
        res.sendStatus(200);
    } catch (err){
        next(err);
    }
}));

router.get('/courses/enrolled', USER, asyncHandler(async (req, res, next) => {
    try {
        const courses = await Course.find({_id: {$in: req.user.enrolled_courses}, hidden: false}, "-lessons");
        res.status(200).json(courses);
    } catch (err){
        next(err);
    }
}));
router.get('/courses/:course_id/:lesson_id', USER, asyncHandler(async (req, res, next) => {
    const {course_id, lesson_id} = req.params;
    if (!req.user.enrolled_courses.find((item) => {return course_id === item})){
        return next(errors.unauthorizedForCourse);
    }
    try {
        const course = await Course.findOne({_id: course_id});
        const lesson = course.lessons.id(lesson_id);
        res.status(200).json(lesson);
    } catch (err){
        next(err);
    }
}));
// Admin only
router.get('/courses/all', ADMIN, asyncHandler(async (req, res, next) => {
    try {
        const courses = await Course.find({}, "-lessons");
        res.status(200).json(courses);
    } catch (err){
        next(err);
    }
}));
router.get('/lessons/:course_id', ADMIN, asyncHandler(async (req, res, next) => {
    try {
        const course = await Course.findOne({_id: req.params.course_id}, 'lessons');
        res.status(200).json(course.lessons);
    } catch (err){
        next(err);
    }
}));
router.post('/courses/add', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.title){
        return next(errors.badRequest);
    }
    const {title} = req.body;
    const course = new Course({title});
    try {
        await course.save();
        const courses = await Course.find();
        res.status(200).send(courses);
    } catch (err) {
        next(err);
    }
}));
router.post('/courses/edit', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.course || !req.body.course._id){
        return next(errors.badRequest);
    }
    try {
        const {course} = req.body;
        await Course.update({_id: course._id}, course);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}));
router.post('/courses/delete', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.course_id){
        return next(errors.badRequest);
    }
    try {
        const {course_id} = req.body;
        await Course.deleteOne({_id: course_id});
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}));
router.post('/lessons/add', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.title || !req.body.course_id){
        return next(errors.badRequest);
    }
    const {title, course_id} = req.body;
    try {
        const course = await Course.findOne({_id: course_id});
        course.lessons.push({title});
        const updated_course = await course.save();
        res.status(200).json(updated_course.lessons);
    } catch (err) {
        next(err);
    }
}));
router.post('/lessons/edit', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.lesson || !req.body.lesson._id || !req.body.course_id){
        return next(errors.badRequest);
    }
    try {
        const {lesson, course_id} = req.body;
        console.log("[api.js] type of lesson.content", typeof lesson.content);
        await Course.update({"_id": course_id, "lessons._id": lesson._id }, {"lessons.$": lesson});
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}));
router.post('/lessons/delete', ADMIN, asyncHandler(async (req, res, next)=>{
    if (!req.body || !req.body.course_id || !req.body.lesson_id){
        return next(errors.badRequest);
    }
    try {
        const {course_id, lesson_id} = req.body;
        await Course.update({_id: course_id}, {$pull: { lessons: {_id: lesson_id}}});
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}));

//All users
router.get('/courses', asyncHandler(async (req, res, next) => {
    try {
        const courses = await Course.find({hidden: false, ...req.query.params}, "-lessons");
        res.status(200).json(courses);
    } catch (err){
        next(err);
    }
}));
router.get('/courses/:course_id', asyncHandler(async (req, res, next) => {
    try {
        const course = await Course.findOne({_id: req.params.course_id}, "-lessons.content");
        res.status(200).json(course);
    } catch (err){
        next(err);
    }
}));



// public
router.get('/categories', asyncHandler(async (req, res, next) => {
    try {
        const categories = await Course.find({hidden: false}).distinct("category");
        res.status(200).json(categories);
    } catch (err){
        next(err);
    }
}));



module.exports = router;