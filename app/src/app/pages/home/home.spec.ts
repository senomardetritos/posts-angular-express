import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Home } from "./home";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { of } from "rxjs";
import { PostsResponseInterface } from "../../interfaces/posts-interface";

describe("Home quando existir param search", () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  const mockActivatedRouteWithParam = {
    params: of({ search: "teste" }), // Return your desired mock ID in an observable
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithParam }, // Or mockActivatedRouteObservable
      ],
      imports: [Home, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Verificando param.search do activatedRoute quando ngOnInit", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      expect(component.search).toBe(param["search"]);
    });
    component.ngOnInit();
  });

  it("Deveria chamar o postService.search e setar posts quando tem resultado", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      if (param["search"]) {
        const postServiceSpy = jest.spyOn(component["postService"], "search");
        const mockResult = {
          data: { id: "1" },
        } as unknown as PostsResponseInterface;
        postServiceSpy.mockReturnValue(of(mockResult));
        expect(postServiceSpy).toHaveBeenCalled();
        expect(component.posts).toBe(mockResult.data);
      }
    });
    component.ngOnInit();
  });

  it("Deveria chamar o postService.search e setar posts com [] quando não tiver resultado", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      if (param["search"]) {
        const postServiceSpy = jest.spyOn(component["postService"], "search");
        const mockResult = {} as unknown as PostsResponseInterface;
        postServiceSpy.mockReturnValue(of(mockResult));
        expect(postServiceSpy).toHaveBeenCalled();
        expect(component.posts.length).toBe(0);
      }
    });
    component.ngOnInit();
  });
});

describe("Home quando existir param search", () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  const mockActivatedRouteWithOutParam = {
    params: of({}), // Return your desired mock ID in an observable
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithOutParam }, // Or mockActivatedRouteObservable
      ],
      imports: [Home, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Deveria chamar o postService.lasts e setar posts quando tem resultado", () => {
    mockActivatedRouteWithOutParam.params.subscribe(() => {
      const postServiceSpy = jest.spyOn(component["postService"], "lasts");
      const mockResult = {
        data: { id: "1" },
      } as unknown as PostsResponseInterface;
      postServiceSpy.mockReturnValue(of(mockResult));
      expect(postServiceSpy).toHaveBeenCalled();
      expect(component.posts).toBe(mockResult.data);
    });
    component.ngOnInit();
  });

  it("Deveria chamar o postService.lasts e setar posts com [] quando não tiver resultado", () => {
    mockActivatedRouteWithOutParam.params.subscribe(() => {
      const postServiceSpy = jest.spyOn(component["postService"], "lasts");
      const mockResult = {} as unknown as PostsResponseInterface;
      postServiceSpy.mockReturnValue(of(mockResult));
      expect(postServiceSpy).toHaveBeenCalled();
      expect(component.posts.length).toBe(0);
    });
    component.ngOnInit();
  });
});
