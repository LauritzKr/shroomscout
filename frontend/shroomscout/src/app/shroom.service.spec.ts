import { TestBed } from '@angular/core/testing';
import { ShroomService } from './shroom.service';

describe('ShroomService', () => {
  let service: ShroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
