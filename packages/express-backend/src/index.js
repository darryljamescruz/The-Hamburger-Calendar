// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import eventRoutes from "./routes/Events.js";
import "./services/poller.js";

dotenv.config();
const app = express();

try {
  // TODO: needs to be changed to the build folder
  //const staticDir = path.join(__dirname, '../../react-frontend/build');
  //const staticDir = path.join(__dirname, '../react-frontend/build');
  // const staticDir = path.join(__dirname, "../../react-frontend/dist"); // not ../react-frontend/build
  // console.log("Index.js will serve static files from:", staticDir);

  app.use(cors({
   origin: 'https://hamburgerscalendar.netlify.app', // netlify frontend url build
   credentials: true
  }));  
  
  app.use(express.json());

  // connect to Mongo -> called in config/db.js
  await connectDB();

  // mount routes
  app.use("/api/auth", authRoutes);
  app.use("/api/events", eventRoutes);

  // Serve static files from the React frontend app
  // app.use(express.static(staticDir));

  // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(staticDir, "index.html"));
  // });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1); // Exit the process with failure
}
