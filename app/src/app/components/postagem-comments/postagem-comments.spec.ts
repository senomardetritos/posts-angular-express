import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PostagemComments } from "./postagem-comments";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { CommentsResponseInterface } from "../../interfaces/comment-interface";
import { of } from "rxjs";

describe("PostagemComments", () => {
  let component: PostagemComments;
  let fixture: ComponentFixture<PostagemComments>;
  let commentsResponse: CommentsResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [PostagemComments],
    }).compileComponents();

    fixture = TestBed.createComponent(PostagemComments);
    component = fixture.componentInstance;
    commentsResponse = {} as CommentsResponseInterface;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar list no ngOnInit e retornar CommentsResponseInterface", () => {
    component["commentService"].list("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(commentsResponse);
    });
  });

  it("Deveria chamar list no ngOnInit e retornar CommentsResponseInterface", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "list");
    const listCommentsSpy = jest.spyOn(component.list_comments, "update");
    const mockData = {
      data: {},
      error: "",
    } as CommentsResponseInterface;
    commentServiceSpy.mockReturnValue(of(mockData));
    component.ngOnInit();
    expect(listCommentsSpy).toHaveBeenCalled();
  });

  it("Deveria chamar list no ngOnInit e retornar CommentsResponseInterface", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "list");
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockData = {} as CommentsResponseInterface;
    commentServiceSpy.mockReturnValue(of(mockData));
    component.ngOnInit();
    expect(alertSpy).toHaveBeenCalled();
  });

  it("Verifica função onSubmit", () => {
    const onSubmitSpy = jest.spyOn(component, "onSubmit");
    component.onSubmit();
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it("Verifica função onSubmit set comment", () => {
    component.formComment.get("comment")?.setValue("Testando");
    component.onSubmit();
    const lastData = component.list_comments().reverse()[0];
    expect(lastData.comment).toBe("Testando");
  });

  it("Deveria chamar add no onSubmit quando resposta é válida", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "add");
    const listCommentsSpy = jest.spyOn(component.list_comments, "update");
    const mockData = {
      data: {},
      error: "",
    } as CommentsResponseInterface;
    component.formComment.get("comment")?.setValue("Testando");
    commentServiceSpy.mockReturnValue(of(mockData));
    component.onSubmit();
    expect(listCommentsSpy).toHaveBeenCalled();
  });

  it("Deveria chamar add no onSubmit quando resposta é inválida", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "add");
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockData = {} as CommentsResponseInterface;
    component.formComment.get("comment")?.setValue("Testando");
    commentServiceSpy.mockReturnValue(of(mockData));
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalled();
    expect(component["modalService"].showAlert).toHaveBeenCalledWith(
      "Erro ao enviar comentário",
      "ERROR"
    );
  });

  it("Verifica função deleteComment", () => {
    const deleteCommentSpy = jest.spyOn(component, "deleteComment");
    component.deleteComment("1");
    expect(deleteCommentSpy).toHaveBeenCalled();
  });

  it("Deveria chamar delete no deleteComment quando resposta é válida", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "delete");
    const listCommentsSpy = jest.spyOn(component.list_comments, "update");
    const mockData = {
      data: {},
      error: "",
    } as CommentsResponseInterface;
    commentServiceSpy.mockReturnValue(of(mockData));
    component.deleteComment("1");
    expect(listCommentsSpy).toHaveBeenCalled();
  });

  it("Deveria chamar delete no deleteComment quando resposta é inválida", () => {
    const commentServiceSpy = jest.spyOn(component["commentService"], "delete");
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockData = {} as CommentsResponseInterface;
    commentServiceSpy.mockReturnValue(of(mockData));
    component.deleteComment("1");
    expect(alertSpy).toHaveBeenCalled();
    expect(component["modalService"].showAlert).toHaveBeenCalledWith(
      "Erro ao excluir comentário",
      "ERROR"
    );
  });

  it("Verifica função modalComments", () => {
    const show = false;
    component.showComments.update(() => show);
    component.modalComments();
    expect(component.showComments()).toBe(!show);
  });
});
