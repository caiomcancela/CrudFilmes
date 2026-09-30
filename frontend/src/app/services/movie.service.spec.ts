import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { MovieService } from "./movie.service";

describe("MovieService", () => {
  let service: MovieService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it("should list all movies without search filters", () => {
    service.list().subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/movies`);
    expect(request.request.params.has("search")).toBe(false);
    request.flush([]);
  });

  it("should send the search term as a query parameter", () => {
    service.list({ search: "Ficção Científica" }).subscribe();

    const request = httpTesting.expectOne(
      (item) => item.url === `${environment.apiUrl}/movies`,
    );
    expect(request.request.params.get("search")).toBe("Ficção Científica");
    request.flush([]);
  });
});
