const express = require('express')
const path = require('path')
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoUrl =
  "mongodb+srv://dima:QXWWh3icr5xxw8mV@cluster0.kgiqr.mongodb.net/store";
const userMidddleware = require('./middlewares/user')
const csurf = require('csurf')

const homeRoute = require('./Routes/Home')
const coursesRoute = require('./Routes/Courses')
const addRoute = require('./Routes/Add')
const cardRoute = require('./Routes/Card');
const orderRoute = require('./Routes/Order');
const authRoute = require('./Routes/Auth')
const User = require('./models/User');
const keys = require("./keys");

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const mongoStore = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine('hbs', hbs.engine) //reg of engine
app.set('view engine', 'hbs') // using
app.set('views', 'views')

/*app.use( async (req, res, next) => {
    try {
        const user = await User.findById('5f04b73ab64a632f407beca2')
        req.user = user
        next()
    } catch(e) {
        throw e
    }
})*/

app.use(express.static(path.join(__dirname, 'public'))) //for linking css files from 'public' dir in the root of proj | static dir | for client's scripts
app.use(express.urlencoded({extended: true})) //middleware for getting post data | body parser
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);
app.use(csurf())
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuth
    res.locals.csurf = req.csrfToken()
    next()
})
app.use(userMidddleware)
//routers
app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add', addRoute)
app.use('/card', cardRoute)
app.use('/orders', orderRoute)
app.use('/auth', authRoute)
//qhDwY2Baknf3ESbP

/*app.get('/', (req, res) => {
    res.status(200)
    //res.sendFile(path.join(__dirname, 'views', 'index.html'))
    res.render('index', {
        title: 'main',
        isHome: true
    })
})

app.get('/courses', (req, res) => {
    res.status(200)
    res.render('courses', {
        title: 'courses',
        isCourses: true
    })
})

app.get('/add', (req, res) => {
    res.status(200)
    res.render('add', {
        title: 'add',
        idAdd: true
    })
})*/


const port = process.env.port || 3000

const start = async (port) => {
    try { 
        await mongoose.connect(keys.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });

        const candidate = await User.findOne()

        /*if(!candidate) {
            const user = new User({
                email: 'kirildim16@gmail.com',
                name: 'dmoneone',
                cart: {
                    items: []
                }
            })

            await user.save()
        }*/

        app.listen(port, () => {
            console.log(`Server has been launched. Port: ${port}`)
        })
    } catch(e) {
        throw e
    }
}

start(port)