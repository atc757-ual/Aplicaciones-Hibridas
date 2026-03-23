import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentecreatePage } from './incidentecreate.page';

describe('IncidentecreatePage', () => {
  let component: IncidentecreatePage;
  let fixture: ComponentFixture<IncidentecreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentecreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
