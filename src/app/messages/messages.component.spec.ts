import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessagesComponent } from './messages.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MessageService } from '../message.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageServiceSpy: { messages: string[]; clear: any; };


  beforeEach(async () => {
    
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['clear']);
    messageServiceSpy.clear.and.callFake(function () {
      messageServiceSpy.messages = [];
    });
    messageServiceSpy.messages = ['Test1', 'Test2'];

    await TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [{ provide: MessageService, useValue: messageServiceSpy }]

    })
      .compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear messages', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(messageServiceSpy.clear).toHaveBeenCalled();
    expect(messageServiceSpy.messages.length).toEqual(0); 
  });

});
