import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { getAllLoops, uploadLoop } from "../controllers/loop.controllers.js";
import { like } from "../controllers/loop.controllers.js";
import { comment } from "../controllers/loop.controllers.js";


const loopRouter=express.Router();

loopRouter.post("/upload",isAuth,upload.single("media"),
uploadLoop);

loopRouter.get("/getAll",isAuth,getAllLoops);

loopRouter.get("/like/:loopId",isAuth,like);

loopRouter.post("/comment/:loopId",isAuth,comment)


export default loopRouter;