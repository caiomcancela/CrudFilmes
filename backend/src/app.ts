import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import pool from "./config/database";
import movieRoutes from "./routes/movie.routes";
import { NotFoundError, ValidationError } from "./services/movie.service";

const app = express();

pool.on("error", (error) => {
  console.error("Erro inesperado em uma conexao ociosa do banco:", error);
});

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use("/api", movieRoutes);

app.use((_request, response) => {
  response.status(404).json({ message: "Rota nao encontrada." });
});

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof SyntaxError && "body" in error) {
    response
      .status(400)
      .json({ message: "O corpo da requisicao contem JSON invalido." });
    return;
  }

  if (error instanceof ValidationError) {
    response.status(400).json({ message: error.message });
    return;
  }

  if (error instanceof NotFoundError) {
    response.status(404).json({ message: error.message });
    return;
  }

  console.error(error);

  const codigo =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  const errosDeConexao = new Set([
    "ENOTFOUND",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ENETUNREACH",
    "28P01",
    "3D000",
  ]);

  if (errosDeConexao.has(codigo)) {
    response.status(503).json({
      message:
        "Banco de dados indisponivel. Verifique a DATABASE_URL do Session pooler no Supabase.",
    });
    return;
  }

  response.status(500).json({ message: "Erro interno do servidor." });
};

app.use(errorHandler);

export default app;
