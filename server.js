require("dotenv-safe").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const app = express();
const i18n = require("i18n");
const initMongo = require("./config/mongo");
const path = require("path");
global.CronJob = require("./database-backup/cron.js");
app.set("view engine", "ejs");
const http = require("http");

const {
  futureTradePair,
} = require("./app/middleware/ImperialApi/futureTradePair");

const { tradeStatus } = require("./app/controllers/trade/creonjob");
// const { allTickers } = require('./app/controllers/assets/allTickersCron')
const { AllTickersUpdate } = require("./app/controllers/assets/FUTURECRON");
const {
  WalletBAlanceUpdateCron,
} = require("./app/controllers/wallet/CRON_Wallet_balanceupdate");
const { subAccountBalance } = require("./app/controllers/wallet");
const { deletePlan } = require("./app/controllers/users/createPlan");
// Setup express server port from ENV, default: 3000
app.set("port", process.env.PORT || 3000);

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === "true") {
  const getExpeditiousCache = require("express-expeditious");
  const cache = getExpeditiousCache({
    namespace: "expresscache",
    defaultTtl: "1 minute",
    engine: require("expeditious-engine-redis")({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    }),
  });
  app.use(cache);
}

// for parsing json
app.use(
  bodyParser.json({
    limit: "20mb",
  })
);
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
  })
);

// i18n
i18n.configure({
  locales: ["en", "es"],
  directory: `${__dirname}/locales`,
  defaultLocale: "en",
  objectNotation: true,
});
app.use(i18n.init);

// Init all other stuff
app.use(cors());
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(express.static("public"));
app.use("/imperialAPI", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
const { Server } = require("socket.io");

const server = http.createServer(app);
// const Server = socketIO(server);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room1", (data) => {
    // console.log("dat",data)
    socket.join(data.room);
  });

  socket.on("send_message1", (data) => {
    // console.log("recieve data", data)
    socket.to(data.room).emit("receive_message1", data);
  });

  socket.on("disconnect", () => { });
});

app.use(require("./app/routes"));

// app.listen(app.get('port'))
server.listen(app.get("port"));

// app.use('/viewmailfile', (req, res, next) => {
//   const filedata = path.join(__dirname, './views/verify.ejs')
//   res.render(filedata, { otp: '12345', username: 'adsf' })
// })

//An error handling middleware
process.on("uncaughtException", (error, origin) => {
  console.log("----- Uncaught exception -----");
  console.log(error);
  // console.log('----- Exception origin -----')
  // console.log(origin)
});

// cron.schedule("*/15 * * * * *", function () {
//   WalletBAlanceUpdateCron()
// });

const cron = require("node-cron");

cron.schedule("*/20 * * * * *", function () {
  tradeStatus();
});

cron.schedule("*/15 * * * * *", function () {
  subAccountBalance();
});

cron.schedule("*/60* * * * *", function () {
  futureTradePair();
});

cron.schedule("0 */2 * * *", function () {
  AllTickersUpdate();
});

cron.schedule("0 0 * * *", function () {
  deletePlan();
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("----- Unhandled Rejection at -----");
  console.log(promise);
});

// Init MongoDB
initMongo();

module.exports = app; // for testing
// for testing
