import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Profile } from "./profile";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ProfileResponseInterface } from "../../interfaces/users-interface";
import { of } from "rxjs";

describe("Profile", () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  const mockPassword = {
    actual_password: "123456",
    new_password: "123456",
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Profile],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria setar o name do formProfile no profileService.getProfile se dados válidos", () => {
    const getProfileSpy = jest.spyOn(component["profileService"], "getProfile");
    const mockResult = {
      data: { name: "Teste" },
    } as unknown as ProfileResponseInterface;
    getProfileSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(component.formProfile.get("name")?.value).toBe("Teste");
  });

  it("Deveria chamar alert no profileService.getProfile se dados inválidos", () => {
    const getProfileSpy = jest.spyOn(component["profileService"], "getProfile");
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as ProfileResponseInterface;
    getProfileSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Erro ao carregar o perfil",
      "ERROR"
    );
  });

  it("Deveria chamar markAllAsTouched no onSubmitProfile", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formProfile,
      "markAllAsTouched"
    );
    component.onSubmitProfile();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar alert no onSubmitProfile se dados válidos", () => {
    const updateProfileSpy = jest.spyOn(
      component["profileService"],
      "updateProfile"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      data: { name: "Teste de Perfil" },
    } as unknown as ProfileResponseInterface;
    updateProfileSpy.mockReturnValue(of(mockResult));
    component.formProfile.setValue(mockResult.data);
    component.onSubmitProfile();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Dados alterados com sucesso",
      "SUCCESS"
    );
  });

  it("Deveria chamar alert no onSubmitProfile se dados inválidos", () => {
    const updateProfileSpy = jest.spyOn(
      component["profileService"],
      "updateProfile"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as ProfileResponseInterface;
    updateProfileSpy.mockReturnValue(of(mockResult));
    component.formProfile.setValue({ name: "Teste de Perfil" });
    component.onSubmitProfile();
    expect(modalServiceSpy).toHaveBeenCalledWith("Erro", "ERROR");
  });

  it("Deveria chamar markAllAsTouched no onSubmitPhoto", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formPhoto,
      "markAllAsTouched"
    );
    component.onSubmitPhoto();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar alert no onSubmitPhoto se dados válidos", () => {
    const uploadPhotoSpy = jest.spyOn(
      component["profileService"],
      "uploadPhoto"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      data: { photo: {} },
    } as unknown as ProfileResponseInterface;
    uploadPhotoSpy.mockReturnValue(of(mockResult));
    component.formPhoto.setValue(mockResult.data);
    component.onSubmitPhoto();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Foto alterada com sucesso",
      "SUCCESS"
    );
  });

  it("Deveria chamar alert no onSubmitPhoto se dados inválidos", () => {
    const uploadPhotoSpy = jest.spyOn(
      component["profileService"],
      "uploadPhoto"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as ProfileResponseInterface;
    uploadPhotoSpy.mockReturnValue(of(mockResult));
    component.formPhoto.setValue({ photo: {} });
    component.onSubmitPhoto();
    expect(modalServiceSpy).toHaveBeenCalledWith("Erro", "ERROR");
  });

  it("Deveria chamar o onFileSelected e setar o formPhoto.photo com o arquivo", () => {
    const mockFile = new File(["file content"], "test.txt", {
      type: "text/plain",
    });
    const fileInput = fixture.nativeElement.querySelector("#photo");
    Object.defineProperty(fileInput, "files", {
      value: {
        0: mockFile,
        length: 1,
        item: () => mockFile,
      },
    });
    const onFileSelectedSpy = jest.spyOn(component, "onFileSelected");
    fileInput.dispatchEvent(new Event("change"));
    expect(onFileSelectedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o onFileSelected e não setar o formPhoto.photo quando não tiver o arquivo", () => {
    const fileInput = fixture.nativeElement.querySelector("#photo");
    const onFileSelectedSpy = jest.spyOn(component, "onFileSelected");
    fileInput.dispatchEvent(new Event("change"));
    expect(onFileSelectedSpy).toHaveBeenCalled();
    expect(component.formPhoto.get("photo")?.value).toBe(null);
  });

  it("Deveria chamar markAllAsTouched no onSubmitPassword", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formPassword,
      "markAllAsTouched"
    );
    component.onSubmitPassword();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar alert no onSubmitPassword se dados válidos", () => {
    const changePasswordSpy = jest.spyOn(
      component["profileService"],
      "changePassword"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      data: {},
    } as unknown as ProfileResponseInterface;
    changePasswordSpy.mockReturnValue(of(mockResult));
    component.formPassword.setValue(mockPassword);
    component.onSubmitPassword();
    expect(modalServiceSpy).toHaveBeenCalledWith(
      "Senha alterada com sucesso",
      "SUCCESS"
    );
  });

  it("Deveria chamar alert no onSubmitPassword se dados inválidos", () => {
    const changePasswordSpy = jest.spyOn(
      component["profileService"],
      "changePassword"
    );
    const modalServiceSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = {
      error: "Erro",
    } as unknown as ProfileResponseInterface;
    changePasswordSpy.mockReturnValue(of(mockResult));
    component.formPassword.setValue(mockPassword);
    component.onSubmitPassword();
    expect(modalServiceSpy).toHaveBeenCalledWith("Erro", "ERROR");
  });
});
