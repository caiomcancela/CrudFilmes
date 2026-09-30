import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { MovieService } from "../../services/movie.service";
import { MovieFormDialogComponent } from "./movie-form-dialog.component";

describe("MovieFormDialogComponent", () => {
  let fixture: ComponentFixture<MovieFormDialogComponent>;

  const movieService = {
    create: vi.fn(() => of({})),
    update: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFormDialogComponent],
      providers: [{ provide: MovieService, useValue: movieService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieFormDialogComponent);
  });

  it("should create the movie form", () => {
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[role="dialog"]'),
    ).not.toBeNull();
  });
});
