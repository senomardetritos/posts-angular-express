import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormPostagem } from "./form-postagem";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { PostResponseInterface } from "../../interfaces/posts-interface";

describe("FormPostagem quando recebe param id", () => {
  let component: FormPostagem;
  let fixture: ComponentFixture<FormPostagem>;
  const mockActivatedRouteWithParam = {
    params: of({ id: "1" }), // Return your desired mock ID in an observable
  };
  const mockForm = {
    id: "1",
    user_id: "1",
    title: "Teste Post",
    text: "Teste de Postagem",
    date: Date.now(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithParam },
      ],
      imports: [FormPostagem, RouterModule.forRoot([]), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPostagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("inicializa form", () => {
    component.formPostagem.setValue(mockForm);
    expect(component.formPostagem.getRawValue()["title"]).toBe(mockForm.title);
  });

  it("Verificando param.id do activatedRoute quando ngOnInit", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      expect(component.formPostagem.get("id")?.value).toBe(param["id"]);
    });
    component.ngOnInit();
  });

  it("Deveria chamar o postService.get e setar formPostagem quando tem resultado", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      if (param["id"]) {
        const postServiceSpy = jest.spyOn(component["postService"], "get");
        const mockResult = {
          data: { id: "1" },
        } as unknown as PostResponseInterface;
        postServiceSpy.mockReturnValue(of(mockResult));
        expect(postServiceSpy).toHaveBeenCalled();
        expect(component.formPostagem.value).toBe(mockResult.data);
      }
    });
    component.ngOnInit();
  });

  it("Deveria chamar o postService.get e setar formPostagem quando não tiver resultado", () => {
    mockActivatedRouteWithParam.params.subscribe((param) => {
      if (param["id"]) {
        const postServiceSpy = jest.spyOn(component["postService"], "get");
        const modalServiceSpy = jest.spyOn(
          component["modalService"],
          "showAlert"
        );
        const mockResult = {
          error: "Erro",
        } as unknown as PostResponseInterface;
        postServiceSpy.mockReturnValue(of(mockResult));
        expect(postServiceSpy).toHaveBeenCalled();
        expect(modalServiceSpy).toHaveBeenCalledWith(mockResult.error, "ERROR");
      }
    });
    component.ngOnInit();
  });

  it("Deveria chamar markAllAsTouched no onSubmit", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formPostagem,
      "markAllAsTouched"
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar addPost no onSubmit se form é válido e isNewPost = true", () => {
    const addPostSpy = jest.spyOn(component, "addPost");
    const mockFormCopy = Object.assign({}, mockForm);
    mockFormCopy.id = "";
    component.formPostagem.setValue(mockFormCopy);
    component.onSubmit();
    expect(addPostSpy).toHaveBeenCalled();
  });

  it("Deveria chamar updatePost no onSubmit se form é válido e isNewPost = false", () => {
    const updatePostSpy = jest.spyOn(component, "updatePost");
    component.formPostagem.setValue(mockForm);
    component.onSubmit();
    expect(updatePostSpy).toHaveBeenCalled();
  });

  it("Deveria chamar alert e navigate no addPost se dados válidos", () => {
    const postServiceSpy = jest.spyOn(component["postService"], "add");
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const navigateSpy = jest.spyOn(component["router"], "navigate");
    const mockResult = {
      data: { id: "1" },
    } as unknown as PostResponseInterface;
    postServiceSpy.mockReturnValue(of(mockResult));
    component.addPost();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Post adicionado com sucesso",
      "SUCCESS"
    );
    expect(navigateSpy).toHaveBeenCalledWith(["/minhas-postagens"]);
  });

  it("Deveria chamar alert no addPost se dados inválidos", () => {
    const postServiceSpy = jest.spyOn(component["postService"], "add");
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as PostResponseInterface;
    postServiceSpy.mockReturnValue(of(mockResult));
    component.addPost();
    expect(modalServiceSpy).toHaveBeenCalledWith("Erro", "ERROR");
  });

  it("Deveria chamar alert e navigate no updatePost se dados válidos", () => {
    const postServiceSpy = jest.spyOn(component["postService"], "update");
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const navigateSpy = jest.spyOn(component["router"], "navigate");
    const mockResult = {
      data: { id: "1" },
    } as unknown as PostResponseInterface;
    postServiceSpy.mockReturnValue(of(mockResult));
    component.updatePost();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Post atualizado com sucesso",
      "SUCCESS"
    );
    expect(navigateSpy).toHaveBeenCalledWith(["/minhas-postagens"]);
  });

  it("Deveria chamar alert no updatePost se dados inválidos", () => {
    const postServiceSpy = jest.spyOn(component["postService"], "update");
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as PostResponseInterface;
    postServiceSpy.mockReturnValue(of(mockResult));
    component.updatePost();
    expect(modalServiceSpy).toHaveBeenCalledWith("Erro", "ERROR");
  });
});

describe("FormPostagem", () => {
  let component: FormPostagem;
  let fixture: ComponentFixture<FormPostagem>;
  const mockActivatedRouteWithOutParam = {
    params: of({}), // Return your desired mock ID in an observable
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithOutParam },
      ],
      imports: [FormPostagem, RouterModule.forRoot([]), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPostagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Deveria chamar o postService.get e setar formPostagem quando tem resultado", () => {
    mockActivatedRouteWithOutParam.params.subscribe(() => {
      const modalServiceSpy = jest.spyOn(
        component["modalService"],
        "showAlert"
      );
      expect(modalServiceSpy).toHaveBeenCalledWith(
        "Erro ao carregar dados do perfil",
        "ERROR"
      );
    });
    component.ngOnInit();
  });
});
