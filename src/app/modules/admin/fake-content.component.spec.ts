import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeContentComponent } from './fake-content.component';

describe('FakeContentComponent', () => {
  let component: FakeContentComponent;
  let fixture: ComponentFixture<FakeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
