import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentedetailPage } from '../incidentedetail.page';

describe('IncidentedetailPage', () => {
  let component: IncidentedetailPage;
  let fixture: ComponentFixture<IncidentedetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
