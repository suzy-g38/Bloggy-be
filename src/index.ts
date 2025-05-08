import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectToDatabase();

    app.post("/", async (req, res) => {
        res.send("Hello World!");
    });


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
  }
};

startServer();


// server.ts (or server.js if you're not using TypeScript)

// import express from "express";
// import cors from "cors";

// const app = express();
// const PORT = 4000;

// console.log("Starting server...");

// // Enable CORS for all origins (you can restrict to specific origins if needed)
// const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
// app.use(cors({
//     origin: allowedOrigins, 
//   }));

// // Parse incoming JSON
// app.use(express.json());

// // Simple GET route at /all
// app.get("/all", (req, res) => {
//   res.json({ message: "This is the /all route", data: [1, 2, 3, 4] });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
