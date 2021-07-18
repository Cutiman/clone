// server.js
const express     = require('express');
const app         = express();
const port        = process.env.PORT || 80;
const server      = require('http').createServer(app);
const io          = require('socket.io')(server);
const userSocket  = io.of('/users');
const adminSocket = io.of('/admin');

//const Ddos = require('ddos')
//const ddos = new Ddos({burst:10, limit:15})
//app.use(ddos.express);

//const path        = require('path');
//const flash    = require('connect-flash');

//const morgan       = require('morgan');
//const cookieParser = require('cookie-parser');
//const bodyParser   = require('body-parser');
//const session      = require('express-session');

//const sessionstore = require('sessionstore');
//const sessionStore = sessionstore.createSessionStore();





// Connect to the Database
const configDB = require('./config/database');
const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex',   true);
mongoose.connect(configDB.url, configDB.options); // kết nối tới database

/**
mongoose.Promise = require("bluebird");
io.use((socket, next) => {
	 mongoose
		.connect(configDB.url, {useNewUrlParser: true})
		.then(() => next())
		.catch(e => console.error(e.stack));
});
*/


// config
require('./config/io')(io); // cấu hình io users
require('./config/admin');  // cấu hình tài khoản admin mặc định

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

/**
app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true
}));
*/
// Cấu hình ứng dụng express
//app.use(morgan('dev'));  // sử dụng để log mọi request ra console
//app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
//app.use(bodyParser());   // lấy thông tin từ form HTML
//app.use(flash()); 

app.set('view engine', 'ejs'); // chỉ định view engine là ejs
app.set('views', './views');   // chỉ định thư mục view

require('./app/routers')(app); // load các routes từ các nguồn

// Serve static html, js, css, and image files from the 'public' directory
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

require('./app/Cron/taixiu2')(io);

require('./usersIO')(userSocket)
require('./adminIO')(adminSocket)

server.listen(port);
