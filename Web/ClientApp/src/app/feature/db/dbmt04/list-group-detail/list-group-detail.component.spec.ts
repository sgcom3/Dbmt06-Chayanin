import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupDetailComponent } from './list-group-detail.component';

describe('ListGroupDetailComponent', () => {
  let component: ListGroupDetailComponent;
  let fixture: ComponentFixture<ListGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListGroupDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
