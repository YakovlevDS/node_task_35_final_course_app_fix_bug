const {Router} = require('express')
const Course = require('../models/Course')
const router = Router()

router.get('/', async (req, res) => {
    try {
      //let courses = await Courses.getAllData()
      let courses = await Course.find().populate("userId", "email name"); //get all data if without params
      //console.log(courses, 'courses_______')
      res.status(200);
      res.render("courses", {
        title: "courses",
        isCourses: true,
        courses,
      });
    }
    catch (e) {
        console.log(e);
    }
  
})

router.get('/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      res.render("course", {
        course,
        title: `Course ${course.title}`,
        layout: "empty",
      });  
    }
    catch (e) {
         console.log(e);
    }
    
})

router.get('/:id/edit', async (req, res) => {
    try {
         if (!req.query.allow) {
           return res.redirect("/");
         }
         const course = await Course.findById(req.params.id);
         res.render("edit-course", {
           title: `Course ${course.title}`,
           course,
         });
    } catch (e) {
        console.log(e);
    }
})

router.post('/edit', async (req, res) => {
    try {
      const { id } = req.body;
      delete req.body.id;
      await Course.findByIdAndUpdate(id, req.body);
      res.redirect("/courses");   
    }
    catch (e){
        console.log(e)
    }
})

router.post('/remove', async (req, res) => {
    try {
          const { id } = req.body;
          await Course.deleteOne({
            _id: id,
          });
          res.redirect("/courses");
    }
    catch (e) {
        console.log(e);
    }
})

module.exports = router