import express from "express";
import { eventRoutes } from "../modules/Event/event.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: eventRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
