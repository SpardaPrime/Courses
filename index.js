const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRouter = require("./routes/courses");
const orderRouter = require("./routes/order");
const CartRouter = require("./routes/cart");
const autRouter = require("./routes/autorize");
const profileRouter = require("./routes/profile");
const catalogRouter = require("./routes/catalog");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandle = require("./middleware/error");
const fileMiddleware = require("./middleware/file");
const keys = require('./keys');


const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils/hbs-helpers"),
});


const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded());

app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(fileMiddleware.single("avatar"));

app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
      "script-src": [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com",
      ],
    },
  })
);
app.use(compression());

app.use(varMiddleware);

app.use(userMiddleware);

app.use(express.text());
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRouter);
app.use("/cart", CartRouter);
app.use("/order", orderRouter);
app.use("/authorization", autRouter);
app.use("/profile", profileRouter);
app.use("/catalog", catalogRouter);
app.use(errorHandle);

let server_port = process.env.PORT || 3000;
let server_host = process.env.YOUR_HOST || '0.0.0.0';
let connect =keys.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(server_port, server_host, () => {
      console.log(`Server is ranning on port ${server_port}...`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
