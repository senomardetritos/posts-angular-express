import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListUser } from "./list-user";
import { UserInterface } from "../../../interfaces/users-interface";
import { RouterModule } from "@angular/router";

describe("ListUser", () => {
  let component: ListUser;
  let fixture: ComponentFixture<ListUser>;
  let mockUsers: UserInterface[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUser, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUser);
    component = fixture.componentInstance;
    mockUsers = [
      { id: "1", name: "Teste1" } as unknown as UserInterface,
      { id: "2", name: "Teste2" } as unknown as UserInterface,
      { id: "3", name: "Teste3" } as unknown as UserInterface,
      { id: "4", name: "Teste4" } as unknown as UserInterface,
    ];
    fixture.componentRef.setInput("users", mockUsers);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria filter_users com no maximo 3 itens", () => {
    expect(component.filter_users().length).toBe(3);
  });

  it("Deveria setar como true o showModal quando onShowModal", () => {
    component.onShowModal();
    expect(component.showModal()).toBe(true);
  });

  it("Deveria setar como true o showModal quando onCloseModal", () => {
    component.onCloseModal();
    expect(component.showModal()).toBe(false);
  });
});
