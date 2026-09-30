import type { NextFunction, Request, Response } from "express";
import * as movieService from "../services/movie.service";

export async function index(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    response.json(await movieService.listMovies(request.query["search"]));
  } catch (error) {
    next(error);
  }
}

export async function show(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    response.json(await movieService.getMovie(String(request.params["id"])));
  } catch (error) {
    next(error);
  }
}

export async function store(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    response.status(201).json(await movieService.createMovie(request.body));
  } catch (error) {
    next(error);
  }
}

export async function update(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    response.json(
      await movieService.updateMovie(
        String(request.params["id"]),
        request.body,
      ),
    );
  } catch (error) {
    next(error);
  }
}

export async function patch(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    response.json(
      await movieService.patchMovie(String(request.params["id"]), request.body),
    );
  } catch (error) {
    next(error);
  }
}

export async function destroy(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await movieService.deleteMovie(String(request.params["id"]));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
