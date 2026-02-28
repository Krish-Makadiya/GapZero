import cors from "cors";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/jobs.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import academicRoutes from "./routes/academic.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/academic", academicRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
