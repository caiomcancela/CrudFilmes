import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Movie, RatingOption } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";

@Component({
  selector: "app-movie-form-dialog",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./movie-form-dialog.component.html",
  styleUrl: "./movie-form-dialog.component.css",
})
export class MovieFormDialogComponent implements OnInit {
  @Input() movie: Movie | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  formData: Movie = this.emptyMovie();
  saving = false;
  error: string | null = null;

  readonly genres = [
    "Ação",
    "Animação",
    "Aventura",
    "Comédia",
    "Documentário",
    "Drama",
    "Fantasia",
    "Ficção Científica",
    "Romance",
    "Suspense",
    "Terror",
  ];

  readonly ratings: RatingOption[] = [
    { value: "L", description: "Livre" },
    { value: "6", description: "Não recomendado para menores de 6 anos" },
    { value: "10", description: "Não recomendado para menores de 10 anos" },
    { value: "12", description: "Não recomendado para menores de 12 anos" },
    { value: "14", description: "Não recomendado para menores de 14 anos" },
    { value: "16", description: "Não recomendado para menores de 16 anos" },
    { value: "18", description: "Não recomendado para menores de 18 anos" },
  ];

  constructor(
    private movieService: MovieService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  get editing(): boolean {
    return this.movie !== null;
  }

  ngOnInit(): void {
    this.formData = this.movie ? { ...this.movie } : this.emptyMovie();
  }

  @HostListener("document:keydown.escape")
  closeWithEscape(): void {
    if (!this.saving) this.close();
  }

  close(): void {
    this.closed.emit();
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const request = this.movie?.id
      ? this.movieService.update(this.movie.id, this.formData)
      : this.movieService.create(this.formData);

    this.error = null;
    this.saving = true;
    request.subscribe({
      next: () => this.saved.emit(),
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.error =
          typeof error.error?.message === "string"
            ? error.error.message
            : "Não foi possível salvar o filme. Tente novamente.";
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private emptyMovie(): Movie {
    return {
      title: "",
      release_year: new Date().getFullYear(),
      genre: "",
      duration: 90,
      rating: "L",
    };
  }
}
