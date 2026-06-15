import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import propertiesRouter from "./properties";
import favoritesRouter from "./favorites";
import messagesRouter from "./messages";
import blogRouter from "./blog";
import agentsRouter from "./agents";
import transactionsRouter from "./transactions";
import teamRouter from "./team";
import seoRouter from "./seo";
import adminRouter from "./admin";
import agentDashboardRouter from "./agent-dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(propertiesRouter);
router.use(favoritesRouter);
router.use(messagesRouter);
router.use(blogRouter);
router.use(agentsRouter);
router.use(transactionsRouter);
router.use(teamRouter);
router.use(seoRouter);
router.use(adminRouter);
router.use(agentDashboardRouter);

export default router;
