import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueDetailComponent } from './list-value-detail.component';

describe('ListValueDetailComponent', () => {
  let component: ListValueDetailComponent;
  let fixture: ComponentFixture<ListValueDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListValueDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListValueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
