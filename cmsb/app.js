const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const errorMiddleware = require("./middleware/error");

// Config

require("dotenv").config({ path: "cmsb/config/config.env" });

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports

const user = require("./routes/userRoute");
const device = require("./routes/deviceRoute");
const log = require("./routes/logRoute");
const frule = require("./routes/fruleRoute");
const tempfrule = require("./routes/tempfruleRoute");
const statusroute = require("./routes/statusRoute");
const staticRoute = require("./routes/StaticRouteRoute");
const tempstaticRoute = require("./routes/tempStaticRouteRoute");
const vlansRoute = require("./routes/VlansRoute");
const tempvlansRoute = require("./routes/tempVlansRoute");
const ipRoute = require("./routes/IpRoute");
const tempipRoute = require("./routes/tempIpRoute");
const ripRoute = require("./routes/RIpRoute");
const tempripRoute = require("./routes/tempRIpRoute");

app.use("/api/v1", user);
app.use("/api/v1", device);
app.use("/api/v1", log);
app.use("/api/v1", frule);
app.use("/api/v1", tempfrule);
app.use("/api/v1", statusroute);
app.use("/api/v1", staticRoute);
app.use("/api/v1", tempstaticRoute);
app.use("/api/v1", vlansRoute);
app.use("/api/v1", tempvlansRoute);
app.use("/api/v1", ipRoute);
app.use("/api/v1", tempipRoute);
app.use("/api/v1", ripRoute);
app.use("/api/v1", tempripRoute);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
