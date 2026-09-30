import dotenv from "dotenv";

dotenv.config();

function configureSupabaseConnection(): void {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) return;

  const url = new URL(connectionString);
  const directHost = /^db\.([a-z0-9]+)\.supabase\.co$/i.exec(url.hostname);
  if (!directHost) return;

  const region = process.env["SUPABASE_DB_REGION"] || "us-east-1";
  url.hostname = `aws-0-${region}.pooler.supabase.com`;
  url.port = "5432";
  url.username = `postgres.${directHost[1]}`;
  url.pathname = "/postgres";
  process.env["DATABASE_URL"] = url.toString();
}

async function startServer(): Promise<void> {
  configureSupabaseConnection();

  const app = (require("./src/app") as typeof import("./src/app")).default;
  const pool = (
    require("./src/config/database") as typeof import("./src/config/database")
  ).default;

  await pool.query("select 1");

  const port = 3000;
  const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void pool.end().finally(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error: unknown) => {
  console.error("Nao foi possivel iniciar o servidor:", error);
  process.exit(1);
});
