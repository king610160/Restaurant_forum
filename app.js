if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport') 
const flash = require('connect-flash') 
// const db = require('./models') 
const { pages, apis } = require('./routes')
const port = process.env.PORT
const handlebarsHelper = require('./helper/handlebars-helpers')
const { getUser } = require('./helper/auth-helpers')

const app = express()

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs', helpers: handlebarsHelper}))
app.set('view engine', 'hbs')
app.use(flash())

// router's related
app.use(express.json())  // 將json打開才能解析json物件
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

// session
app.use(session({
    secret: process.env.sessionSecret, 
    resave: false,  
    saveUninitialized: true 
}))

// autheticated
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能

// success and fail message
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')  // 設定 success_msg 訊息
    res.locals.error_messages = req.flash('error_messages')  // 設定 warning_msg 訊息
    res.locals.user = getUser(req)
    next()
})

// add upload file as image ready to upload
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', apis)
app.use(pages)

app.listen( port , () => {
    console.log(`app is listening on port ${port}`)
})
