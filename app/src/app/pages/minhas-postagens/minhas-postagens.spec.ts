import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MinhasPostagens } from "./minhas-postagens";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";

describe("MinhasPostagens", () => {
  let component: MinhasPostagens;
  let fixture: ComponentFixture<MinhasPostagens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [MinhasPostagens, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhasPostagens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
