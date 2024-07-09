const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require("cors");
const { port } = require('./src/config/config');
const { connectToDB } = require('./src/config/db.config');
const { errorHandler } = require('./src/uitls/errorHandler');

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(fileUpload());
app.use(cors());

const adminRoutes = require('./src/routes/v1/adminRoutes');
const restaurantRoutes = require('./src/routes/v1/restaurantRoutes');
const dashboardRoutes = require("./src/routes/v1/dashboardRoutes");
const orderRoutes = require('./src/routes/v1/orderRoutes');
const menuRoutes = require('./src/routes/v1/menuRoutes');
const itemRoutes = require('./src/routes/v1/itemRoutes');
const tableRoutes = require('./src/routes/v1/tableRoutes');

app.use("/banners", express.static(__dirname + "/banners"));
app.use("/items", express.static(__dirname + "/items"));
app.use("/menus", express.static(__dirname + "/menus/"));

app.use("/", adminRoutes);
app.use("/", restaurantRoutes);
app.use("/", dashboardRoutes);
app.use("/", orderRoutes);
app.use("/", menuRoutes);
app.use("/", itemRoutes);
app.use("/", tableRoutes);


app.get("/", (req, res) => {
    res.send("<h1>QR App is Up and Running</h1>");
});

// Last middleware if any error comes
app.use(errorHandler);

app.listen(port, async() => {
    console.log("Server is running on port", port);

    await connectToDB();
    console.log("Database connected");
});

