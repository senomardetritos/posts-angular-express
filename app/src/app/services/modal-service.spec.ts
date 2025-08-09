import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal-service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

describe("ModalService", () => {
  let service: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(ModalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar showLoading", () => {
    const showLoadingSpy = jest.spyOn(service, "showLoading");
    service.showLoading();
    expect(showLoadingSpy).toHaveBeenCalled();
  });

  it("Deveria setar isLoading = true quando chamar showLoading", () => {
    service.showLoading();
    service.isLoading.subscribe((res) => {
      expect(res).toBe(true);
    });
  });

  it("Deveria setar isLoading = false quando chamar closeLoading", () => {
    service.closeLoading();
    service.isLoading.subscribe((res) => {
      expect(res).toBe(false);
    });
  });
});
