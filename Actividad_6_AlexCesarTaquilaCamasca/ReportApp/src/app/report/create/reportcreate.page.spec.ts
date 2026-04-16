import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportcreatePage } from './reportcreate.page';

describe('ReportcreatePage', () => {
  let component: ReportcreatePage;
  let fixture: ComponentFixture<ReportcreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportcreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
