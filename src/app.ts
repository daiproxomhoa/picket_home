import express from "express";

import houseRouter from "./routes/house_router";

const app = express();

app.use("/house", houseRouter);

export default app;
