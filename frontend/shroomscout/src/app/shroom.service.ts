import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShroomService {
  private apiUrl = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<MushroomData[]>([]);
  private httpClient: HttpClient = inject(HttpClient);

  // Method to fetch data from the server and update the state
  fetchData(): Observable<MushroomData[]> {
    // If the data has already been fetched, return it as an Observable
    if (this.dataSubject.value.length) {
      return this.dataSubject.asObservable();
    }

    // Otherwise, fetch the data from the server and update the state
    return this.httpClient.get<any>(`${this.apiUrl}/shrooms/finds`).pipe(
      map((response) => {
        return response.data;
      }),
      tap((data) => this.dataSubject.next(data))
    );
  }

  fetchMushrooms(): Observable<string[]> {
    return this.httpClient.get<any>(`${this.apiUrl}/shrooms`).pipe(
      map((response) => {
        return response.data.map((value: any) => value.name);
      })
    );
  }

  // Method to add new data to the server and update the state
  postData(data: MushroomData): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/shrooms`, data).pipe(
      tap(() => {
        // Update the local state with the new data without re-fetching
        const updatedData = [...this.dataSubject.value, data];
        this.dataSubject.next(updatedData);
      })
    );
  }

  // Getter to access the current state as an Observable
  get data$(): Observable<MushroomData[]> {
    return this.dataSubject.asObservable();
  }
}

export interface MushroomData {
  id: number;
  mushroom: string;
  latitude: number;
  longitude: number;
  environment: string;
}
