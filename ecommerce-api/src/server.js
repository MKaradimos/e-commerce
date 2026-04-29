import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = buildApp();
app.listen(env.port, () => {
  console.log(`🚀 Server running at http://localhost:${env.port}`);
  console.log(`📚 API Docs at http://localhost:${env.port}/api/docs`);
  console.log(`💚 Health at http://localhost:${env.port}/health`);
});
