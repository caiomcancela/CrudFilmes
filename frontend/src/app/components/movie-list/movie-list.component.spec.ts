import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideZoneChangeDetection } from "@angular/core";
import { Observable, of } from "rxjs";
import { Movie } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import { MovieListComponent } from "./movie-list.component";

describe("MovieListComponent", () => {
  let fixture: ComponentFixture<MovieListComponent>;

  const movie: Movie = {
    id: "1",
    title: "Interestelar",
    release_year: 2014,
    genre: "Ficção Científica",
    duration: 169,
    rating: "12",
    created_at: "2026-01-01T00:00:00.000Z",
  };

  const movieService = jasmine.createSpyObj<MovieService>("MovieService", [
    "list",
    "delete",
    "create",
    "update",
  ]);

  beforeEach(async () => {
    movieService.list.calls.reset();
    movieService.list.and.returnValue(of([movie]));
    movieService.delete.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: MovieService, useValue: movieService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
  });

  it("should render movie data", () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector(".movie-card h2")?.textContent).toContain(
      "Interestelar",
    );
    expect(element.querySelector(".metadata")?.textContent).toContain("2014");
    expect(element.querySelector(".metadata")?.textContent).toContain(
      "Ficção Científica",
    );
    expect(element.querySelector(".rating")?.textContent).toContain("12");
  });

  it("should finish loading after the asynchronous request completes", async () => {
    movieService.list.and.returnValue(
      new Observable<Movie[]>((subscriber) => {
        setTimeout(() => {
          subscriber.next([movie]);
          subscriber.complete();
        });
      }),
    );

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".spinner")).not.toBeNull();

    await fixture.whenStable();
    expect(fixture.componentInstance.loading).toBe(false);
    expect(fixture.componentInstance.movies).toEqual([movie]);
    expect(fixture.nativeElement.querySelector(".spinner")).toBeNull();
    expect(
      fixture.nativeElement.querySelector(".movie-card h2")?.textContent,
    ).toContain("Interestelar");
  });

  it("should open the form from the main button", () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      ".new-movie-button",
    ) as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("app-movie-form-dialog"),
    ).not.toBeNull();
  });

  it("should render the empty catalog state", () => {
    movieService.list.and.returnValue(of([]));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(".movie-card")).toBeNull();
    expect(
      fixture.nativeElement.querySelector(".state-box")?.textContent,
    ).toContain("Seu catálogo está vazio");
  });

  it("should search through the endpoint", () => {
    fixture.detectChanges();
    movieService.list.calls.reset();
    fixture.componentInstance.searchTerm = "  Interestelar  ";

    fixture.componentInstance.search();

    expect(movieService.list).toHaveBeenCalledWith({ search: "Interestelar" });
  });

  it("should show an empty search state when no movie is found", async () => {
    fixture.detectChanges();
    fixture.componentInstance.movies = [];
    fixture.componentInstance.loading = false;
    fixture.componentInstance.appliedSearch = "inexistente";
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".search-empty-state")?.textContent,
    ).toContain("Nenhum filme encontrado");
  });
});
