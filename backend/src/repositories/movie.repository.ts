import pool from "../config/database";
import type {
  CreateMovieDTO,
  Movie,
  MovieFilters,
  UpdateMovieDTO,
} from "../types/movie";

const MOVIE_COLUMNS = `id,
  titulo as title,
  ano_lancamento as release_year,
  genero as genre,
  duracao as duration,
  indicacao as rating,
  created_at`;

const DATABASE_COLUMNS: Record<keyof CreateMovieDTO, string> = {
  title: "titulo",
  release_year: "ano_lancamento",
  genre: "genero",
  duration: "duracao",
  rating: "indicacao",
};

export async function findAll(filters: MovieFilters = {}): Promise<Movie[]> {
  const values: string[] = [];
  let query = `select ${MOVIE_COLUMNS} from filmes`;

  if (filters.search) {
    values.push(`%${filters.search}%`);
    query += ` where titulo ilike $1
      or genero ilike $1
      or ano_lancamento::text ilike $1
      or duracao::text ilike $1
      or indicacao::text ilike $1`;
  }

  query += " order by created_at desc";
  const result = await pool.query<Movie>(query, values);
  return result.rows;
}

export async function findById(id: string): Promise<Movie | undefined> {
  const result = await pool.query<Movie>(
    `select ${MOVIE_COLUMNS} from filmes where id = $1`,
    [id],
  );
  return result.rows[0];
}

export async function create(data: CreateMovieDTO): Promise<Movie> {
  const result = await pool.query<Movie>(
    `insert into filmes (titulo, ano_lancamento, genero, duracao, indicacao)
     values ($1, $2, $3, $4, $5)
     returning ${MOVIE_COLUMNS}`,
    [data.title, data.release_year, data.genre, data.duration, data.rating],
  );
  return result.rows[0]!;
}

export async function update(id: string, data: CreateMovieDTO): Promise<Movie> {
  const result = await pool.query<Movie>(
    `update filmes
     set titulo = $1, ano_lancamento = $2, genero = $3, duracao = $4, indicacao = $5
     where id = $6
     returning ${MOVIE_COLUMNS}`,
    [data.title, data.release_year, data.genre, data.duration, data.rating, id],
  );
  return result.rows[0]!;
}

export async function patch(
  id: string,
  fields: UpdateMovieDTO,
): Promise<Movie> {
  const keys = Object.keys(fields) as Array<keyof CreateMovieDTO>;
  const assignments = keys.map(
    (key, index) => `${DATABASE_COLUMNS[key]} = $${index + 1}`,
  );
  const values = keys.map((key) => fields[key]);
  const result = await pool.query<Movie>(
    `update filmes
     set ${assignments.join(", ")}
     where id = $${values.length + 1}
     returning ${MOVIE_COLUMNS}`,
    [...values, id],
  );
  return result.rows[0]!;
}

export async function remove(id: string): Promise<void> {
  await pool.query("delete from filmes where id = $1", [id]);
}
