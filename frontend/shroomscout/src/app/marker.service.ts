import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private map: L.Map | null = null;
  private temporaryMarker: L.Marker | null = null;
  private markers: L.Marker[] = [];
  private markerPlaced: boolean = false;

  public initializeMap(map: L.Map): void {
    this.map = map;
  }

  public isMarkerPlaced(): boolean {
    return this.markerPlaced;
  }

  public setMarkerPlacedFalse(): void {
    this.markerPlaced = false;
  }

  /**
   * Places a marker on the last clicked location on the map.
   *
   * @param coords Leaflet coordinates
   */
  public setTemporaryMarker(coords: L.LatLng): void {
    if (!this.map) return;

    this.markerPlaced = true;
    if (this.temporaryMarker) {
      this.temporaryMarker.setLatLng(coords);
    } else {
      this.temporaryMarker = L.marker(coords).addTo(this.map);
    }
  }

  public getTemporaryMarker():L.LatLng|undefined {
    if(this.map && this.temporaryMarker) {
      return this.temporaryMarker.getLatLng();
    }
    return undefined;
  }

  /**
   * Removes the temporary marker from
   * the map and sets it to null.
   */
  public removeTemporaryMarker(): void {
    if (this.map && this.temporaryMarker) {
      this.map.removeLayer(this.temporaryMarker);
      this.temporaryMarker = null;
    }
  }

  public addMarker(latitude:number, longitude:number, mushroom:string) {
    if (!this.map) return;
    const marker = L.marker({lat: latitude, lng: longitude} as L.LatLng)
    .addTo(this.map)
    .bindTooltip(mushroom, {
      permanent: false,
      direction: 'top',
      offset: L.point(-15, -15),
    })
    .openTooltip();
    
    this.markers.push(marker);
  }

  /**
   * Removes the temporary marker and adds a persistent
   * one to the map and the markers array.
   */
  public persistMarker(message: string): void {
    if (!this.map || !this.temporaryMarker) return;

    const coords = this.temporaryMarker.getLatLng();
    this.removeTemporaryMarker();

    this.addMarker(coords.lat, coords.lng, message);
  }
}
