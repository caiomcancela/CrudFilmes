import * as movieRepository from "../repositories/movie.repository";
import {
  RATINGS,
  type CreateMovieDTO,
  type Movie,
  type MovieFilters,
  type Rating,
  type UpdateMovieDTO,
} from "../types/movie";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}

const MOVIE_FIELDS = [
  "title",
  "release_year",
  "genre",
  "duration",
  "rating",
] as const;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function listMovies(search?: unknown): Promise<Movie[]> {
  if (search === undefined) return movieRepository.findAll();

  if (typeof search !== "string") {
    throw new ValidationError("O termo de busca deve ser um texto.");
  }

  const term = search.trim();
  if (term.length > 200) {
    throw new ValidationError(
      "O termo de busca deve ter no maximo 200 caracteres.",
    );
  }

  const filters: MovieFilters = term ? { search: term } : {};
  return movieRepository.findAll(filters);
}

export async function getMovie(id: string): Promise<Movie> {
  validateId(id);
  const movie = await movieRepository.findById(id);
  if (!movie) throw new NotFoundError("Filme nao encontrado.");
  return movie;
}

export function createMovie(input: unknown): Promise<Movie> {
  const movie = validateMovie(input, false) as CreateMovieDTO;
  return movieRepository.create(movie);
}

export async function updateMovie(id: string, input: unknown): Promise<Movie> {
  validateId(id);
  await getMovie(id);
  const movie = validateMovie(input, false) as CreateMovieDTO;
  return movieRepository.update(id, movie);
}

export async function patchMovie(id: string, input: unknown): Promise<Movie> {
  validateId(id);
  await getMovie(id);
  const fields = validateMovie(input, true);
  return movieRepository.patch(id, fields);
}

export async function deleteMovie(id: string): Promise<void> {
  validateId(id);
  await getMovie(id);
  await movieRepository.remove(id);
}

function validateId(id: string): void {
  if (!UUID_REGEX.test(id))
    throw new ValidationError("O id informado e invalido.");
}

function validateMovie(input: unknown, partial: boolean): UpdateMovieDTO {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Informe os dados do filme.");
  }

  const data = input as Record<string, unknown>;
  const presentFields = MOVIE_FIELDS.filter(
    (field) => data[field] !== undefined,
  );
  if (partial && presentFields.length === 0) {
    throw new ValidationError("Informe ao menos um campo para atualizar.");
  }

  if (!partial) {
    const missingFields = MOVIE_FIELDS.filter(
      (field) => data[field] === undefined,
    );
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Campos obrigatorios: ${missingFields.join(", ")}.`,
      );
    }
  }

  const movie: UpdateMovieDTO = {};

  if (data["title"] !== undefined) {
    if (typeof data["title"] !== "string" || !data["title"].trim()) {
      throw new ValidationError("O titulo e obrigatorio.");
    }
    movie.title = data["title"].trim();
  }

  if (data["genre"] !== undefined) {
    if (typeof data["genre"] !== "string" || !data["genre"].trim()) {
      throw new ValidationError("O genero e obrigatorio.");
    }
    movie.genre = data["genre"].trim();
  }

  if (data["release_year"] !== undefined) {
    if (
      !Number.isInteger(data["release_year"]) ||
      Number(data["release_year"]) < 1888 ||
      Number(data["release_year"]) > 2100
    ) {
      throw new ValidationError(
        "O ano de lancamento deve estar entre 1888 e 2100.",
      );
    }
    movie.release_year = data["release_year"] as number;
  }

  if (data["duration"] !== undefined) {
    if (!Number.isInteger(data["duration"]) || Number(data["duration"]) <= 0) {
      throw new ValidationError(
        "A duracao deve ser um numero inteiro maior que zero.",
      );
    }
    movie.duration = data["duration"] as number;
  }

  if (data["rating"] !== undefined) {
    if (
      typeof data["rating"] !== "string" ||
      !RATINGS.includes(data["rating"] as Rating)
    ) {
      throw new ValidationError("A classificacao indicativa e invalida.");
    }
    movie.rating = data["rating"] as Rating;
  }

  return movie;
}
