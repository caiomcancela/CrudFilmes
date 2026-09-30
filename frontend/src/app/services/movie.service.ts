import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Movie } from "../models/movie.model";

@Injectable({ providedIn: "root" })
export class MovieService {
  private readonly apiUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) {}

  list(filters?: { search?: string }): Observable<Movie[]> {
    let params = new HttpParams();
    if (filters?.search) params = params.set("search", filters.search);
    return this.http.get<Movie[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  create(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  update(id: string, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  patch(id: string, fields: Partial<Movie>): Observable<Movie> {
    return this.http.patch<Movie>(`${this.apiUrl}/${id}`, fields);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
