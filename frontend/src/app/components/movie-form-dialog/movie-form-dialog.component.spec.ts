import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { MovieService } from "../../services/movie.service";
import { MovieFormDialogComponent } from "./movie-form-dialog.component";

describe("MovieFormDialogComponent", () => {
  let fixture: ComponentFixture<MovieFormDialogComponent>;

  const movieService = jasmine.createSpyObj<MovieService>("MovieService", [
    "create",
    "update",
  ]);

  beforeEach(async () => {
    movieService.create.and.returnValue(of({} as never));
    movieService.update.and.returnValue(of({} as never));

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
