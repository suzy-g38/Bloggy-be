import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers/postResolvers.js";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();
  
app.use(cors({
    origin: process.env.FE_WEBISITE_URL, 
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  

app.use(express.json());

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
            const userId = req.headers.authorization || '';
            if (!userId) {
              throw new Error('User ID not provided');
            }
            return { userId };
        } catch (err) {
          console.error("Context error:", err);
          throw err;
        }
      },
    }
)
  );

export default app;

