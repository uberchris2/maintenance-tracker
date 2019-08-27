import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteReceiptModalComponent } from './overwrite-receipt-modal.component';

describe('OverwriteReceiptModalComponent', () => {
  let component: OverwriteReceiptModalComponent;
  let fixture: ComponentFixture<OverwriteReceiptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverwriteReceiptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteReceiptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
