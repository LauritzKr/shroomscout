import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { MarkerService } from '../marker.service';
import { ShroomService } from '../shroom.service';
import { Observable, map, of, startWith } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  myControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);

  private router = inject(Router);
  private messageService = inject(MessageService);
  private markerService = inject(MarkerService);
  private shroomService:ShroomService = inject(ShroomService);

  // Values for register form
  protected title: string = 'Pilzdaten angeben:';
  protected environments: string[] = ['Wiese', 'Eiche', 'Buche'];
  protected selectedEnvironment: string = '';
  protected pictureUrl: string = '';

  protected get isMarkerPlaced(): boolean {
    return this.markerService.isMarkerPlaced();
  }

  protected onRegisterClick() {
    // this.messageService.addMessage(message);
    const marker = this.markerService.getTemporaryMarker();
      if(marker && this.nameFormControlIsValid()) {
      this.shroomService.postData({id:-1,mushroom: this.myControl.value??'', latitude: marker.lat, longitude: marker.lng, environment: this.selectedEnvironment}).subscribe();
      this.markerService.persistMarker(this.myControl.value??'');
      this.markerService.setMarkerPlacedFalse();
      this.router.navigate(['']);
    }
  }

  protected nameFormControlIsValid():boolean {
    return this.myControl.valid && this.options.includes(this.myControl.value??'');
  }

  ngOnInit(): void {
    this.shroomService.fetchMushrooms().subscribe((mushrooms) => {
      this.options = mushrooms;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value??''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
