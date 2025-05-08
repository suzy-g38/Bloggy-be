import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
  }
};

startServer();
