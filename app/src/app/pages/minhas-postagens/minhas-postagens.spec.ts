import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MinhasPostagens } from "./minhas-postagens";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { PostsResponseInterface } from "../../interfaces/posts-interface";

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

  it("Deveria setar o posts no ngOnInit quando postService.list trazer resultados", () => {
    const postServiceListSpy = jest.spyOn(component["postService"], "list");
    const mockResult = {
      data: [{ id: "1" }],
    } as unknown as PostsResponseInterface;
    postServiceListSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(postServiceListSpy).toHaveBeenCalled();
    expect(component.posts).toBe(mockResult.data);
  });

  it("Deveria setar o posts no ngOnInit quando postService.list não trazer resultados", () => {
    const postServiceListSpy = jest.spyOn(component["postService"], "list");
    const mockResult = {} as unknown as PostsResponseInterface;
    postServiceListSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(postServiceListSpy).toHaveBeenCalled();
    expect(component.posts.length).toBe(0);
  });
});
