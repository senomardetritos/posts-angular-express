import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendHeader } from './friend-header';

describe('FriendHeader', () => {
  let component: FriendHeader;
  let fixture: ComponentFixture<FriendHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
