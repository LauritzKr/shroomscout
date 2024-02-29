import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of, startWith } from 'rxjs';
import { MarkerService } from '../marker.service';
import { ShroomService } from '../shroom.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private markerService = inject(MarkerService);
  private shroomService = inject(ShroomService);

  protected myControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);
  protected filteredOptions: Observable<string[]> = of([]);

  // Values for register form
  protected title: string = 'Pilzdaten angeben:';
  protected environments: string[] = ['Wiese', 'Eiche', 'Buche'];
  protected selectedEnvironment: string = '';

  private options: string[] = [];

  ngOnInit(): void {
    this.shroomService.fetchMushrooms().subscribe((mushrooms) => {
      this.options = mushrooms;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value ?? ''))
    );
  }

  protected get isMarkerPlaced(): boolean {
    return this.markerService.isMarkerPlaced();
  }

  protected onRegisterClick() {
    const marker = this.markerService.getTemporaryMarker();
    if (marker && this.nameFormControlIsValid()) {
      this.shroomService
        .postData({
          id: -1,
          mushroom: this.myControl.value ?? '',
          latitude: marker.lat,
          longitude: marker.lng,
          environment: this.selectedEnvironment,
        })
        .subscribe();
      this.markerService.persistMarker(this.myControl.value ?? '');
      this.markerService.setMarkerPlacedFalse();
      this.router.navigate(['']);
    }
  }

  protected nameFormControlIsValid(): boolean {
    return (
      this.myControl.valid && this.options.includes(this.myControl.value ?? '')
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
