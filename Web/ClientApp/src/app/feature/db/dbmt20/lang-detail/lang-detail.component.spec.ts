import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangDetailComponent } from './lang-detail.component';

describe('LangDetailComponent', () => {
  let component: LangDetailComponent;
  let fixture: ComponentFixture<LangDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LangDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LangDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
