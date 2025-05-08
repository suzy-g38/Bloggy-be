import express, { Application } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers/postResolvers.js";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import http from 'http';

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Place this after all routes/middleware
app.use((err, req, res, next) => {
    console.error("🔥 Global error handler caught an error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

app.get("/all", async(req, res) => {
    res.send("Hello World!");
});
  
app.use(cors({
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  

app.use(express.json());

// Log origin for debugging
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});
  
  app.use(express.json());
  
  // Log origin for debugging
  app.use((req, res, next) => {
    console.log("Origin:", req.headers.origin);
    console.log("Method:", req.method);
    next();
  });


// Load schema
const typeDefs = gql(readFileSync(resolve(__dirname, "..", "schema.graphql"), "utf-8"));
const schema = buildSubgraphSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });

  // Apollo Server setup
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server,
         {
      context: async ({ req }) => {
        try {
            //console.log("Request Headers:", req.headers);
            const userId = req.headers.authorization || '';
            //console.log("Token:", token);
            if (!userId) {
              throw new Error('User ID not provided');
            }
            return { userId };
        } catch (err) {
          console.error("❌ Context error:", err);
          throw err;
        }
      },
    }
)
  );
  
  // Global error handler (keep at the end)
  app.use((err, req, res, next) => {
    console.error("🔥 Global error handler caught an error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });
  

export default app;
