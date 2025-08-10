import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostagemLikes } from "./postagem-likes";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import {
  LikeInterface,
  LikesResponseInterface,
} from "../../interfaces/like-interface";
import { of } from "rxjs";

describe("PostagemLikes", () => {
  let component: PostagemLikes;
  let fixture: ComponentFixture<PostagemLikes>;
  let userMock: LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [PostagemLikes],
    }).compileComponents();

    fixture = TestBed.createComponent(PostagemLikes);
    component = fixture.componentInstance;
    userMock = {
      data: {
        email: "teste@teste.com",
      },
    } as LoginResponseInterface;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria setar is_liked com user logado", () => {
    component["tokenService"].login(userMock);
    component.list_likes.update(() => [
      {
        user: userMock.data,
      } as unknown as LikeInterface,
    ]);
    expect(component.is_liked()).toBe(true);
  });

  it("Deveria setar list_likes quando chamar likeService.list no ngOnInit com respota da API", () => {
    const likeServiceSpy = jest.spyOn(component["likeService"], "list");
    const mockData = { data: {} } as LikesResponseInterface;
    likeServiceSpy.mockReturnValue(of(mockData));
    component.ngOnInit();
    expect(component.list_likes()).toBe(mockData.data);
  });

  it("Deveria setar list_likes com [] quando chamar likeService.list no ngOnInit sem respota da API", () => {
    const likeServiceSpy = jest.spyOn(component["likeService"], "list");
    const listLikesSpy = jest.spyOn(component.list_likes, "update");
    const mockData = {} as LikesResponseInterface;
    likeServiceSpy.mockReturnValue(of(mockData));
    component.ngOnInit();
    expect(listLikesSpy).toHaveBeenCalled();
    expect(component.list_likes().length).toBe(0);
  });

  it("Deveria chamar setClickLike() no changeLike", () => {
    const setClickLikeSpy = jest.spyOn(component, "setClickLike");
    component.changeLike();
    expect(setClickLikeSpy).toHaveBeenCalled();
  });

  it("Deveria setar list_likes quando chamar likeService.change no changeLike com respota da API", () => {
    const likeServiceSpy = jest.spyOn(component["likeService"], "change");
    const mockData = { data: {} } as LikesResponseInterface;
    likeServiceSpy.mockReturnValue(of(mockData));
    component.changeLike();
    expect(component.list_likes()).toBe(mockData.data);
  });

  it("Deveria setar list_likes com [] quando chamar likeService.change no changeLike sem respota da API", () => {
    const likeServiceSpy = jest.spyOn(component["likeService"], "change");
    const listLikesSpy = jest.spyOn(component.list_likes, "update");
    const mockData = {} as LikesResponseInterface;
    likeServiceSpy.mockReturnValue(of(mockData));
    component.changeLike();
    expect(listLikesSpy).toHaveBeenCalled();
    expect(component.list_likes().length).toBe(0);
  });

  it("Deveria setar o index se o user for encontrado quando chama o setClickLike", () => {
    const listLikesSpy = jest.spyOn(component.list_likes(), "findIndex");
    component.setClickLike();
    expect(listLikesSpy).toHaveBeenCalled();
  });

  it("Deveria retirar o list_likes se o user for encontrado quando chama o setClickLike", () => {
    const listLikesSpy = jest.spyOn(component.list_likes, "update");
    const mockLike = [{ user: userMock.data }] as unknown as LikeInterface[];
    component.list_likes.update(() => mockLike);
    component.setClickLike();
    expect(listLikesSpy).toHaveBeenCalled();
    expect(component.list_likes().length).toBe(0);
  });

  it("Deveria setar o showLikes como not showLikes no modalLikes", () => {
    component.showLikes.update(() => true);
    component.modalLikes();
    expect(component.showLikes()).toBe(false);
  });
});
