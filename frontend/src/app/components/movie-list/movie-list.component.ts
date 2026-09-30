import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";
import { Movie, Rating } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import { MovieFormDialogComponent } from "../movie-form-dialog/movie-form-dialog.component";

@Component({
  selector: "app-movie-list",
  standalone: true,
  imports: [FormsModule, MovieFormDialogComponent],
  templateUrl: "./movie-list.component.html",
  styleUrl: "./movie-list.component.css",
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  loading = true;
  searchTerm = "";
  appliedSearch = "";
  formOpen = false;
  selectedMovie: Movie | null = null;
  message = "";

  private messageTimeout?: ReturnType<typeof setTimeout>;

  private readonly ratingDescriptions: Record<Rating, string> = {
    L: "Livre",
    "6": "Não recomendado para menores de 6 anos",
    "10": "Não recomendado para menores de 10 anos",
    "12": "Não recomendado para menores de 12 anos",
    "14": "Não recomendado para menores de 14 anos",
    "16": "Não recomendado para menores de 16 anos",
    "18": "Não recomendado para menores de 18 anos",
  };

  constructor(
    private movieService: MovieService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  openForm(movie: Movie | null = null): void {
    this.selectedMovie = movie;
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.selectedMovie = null;
  }

  handleSaved(): void {
    this.closeForm();
    this.load();
    this.changeDetectorRef.detectChanges();
  }

  remove(movie: Movie): void {
    this.movieService.delete(movie.id!).subscribe({
      next: () => {
        this.movies = this.movies.filter((item) => item.id !== movie.id);
        this.showMessage("Filme excluído com sucesso.");
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage(this.getErrorMessage(error));
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  getRatingDescription(rating: Rating): string {
    return this.ratingDescriptions[rating];
  }

  search(): void {
    this.searchTerm = this.searchTerm.trim();
    this.appliedSearch = this.searchTerm;
    this.load();
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.appliedSearch = "";
    this.load();
  }

  private load(): void {
    this.loading = true;
    const filters = this.appliedSearch
      ? { search: this.appliedSearch }
      : undefined;
    this.movieService
      .list(filters)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (movies) => (this.movies = movies),
        error: (error: HttpErrorResponse) =>
          this.showMessage(this.getErrorMessage(error)),
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return typeof error.error?.message === "string"
      ? error.error.message
      : "Não foi possível conectar ao servidor. Tente novamente.";
  }

  private showMessage(message: string): void {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.message = message;
    this.messageTimeout = setTimeout(() => {
      this.message = "";
      this.changeDetectorRef.detectChanges();
    }, 4000);
  }
}
