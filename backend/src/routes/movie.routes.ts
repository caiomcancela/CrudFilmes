import { Router } from "express";
import * as movieController from "../controllers/movie.controller";

const router = Router();

router.get("/movies", movieController.index);
router.get("/movies/:id", movieController.show);
router.post("/movies", movieController.store);
router.put("/movies/:id", movieController.update);
router.patch("/movies/:id", movieController.patch);
router.delete("/movies/:id", movieController.destroy);

export default router;
