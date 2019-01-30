import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordMaintenanceComponent } from './record-maintenance.component';

describe('RecordMaintenanceComponent', () => {
  let component: RecordMaintenanceComponent;
  let fixture: ComponentFixture<RecordMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
