import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleMapsPage } from './example_maps';

describe('ExampleMapsPage', () => {
  let component: ExampleMapsPage;
  let fixture: ComponentFixture<ExampleMapsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ExampleMapsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
