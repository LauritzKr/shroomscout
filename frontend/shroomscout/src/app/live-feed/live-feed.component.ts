import { Component, OnInit, inject } from '@angular/core';
import { MarkerService } from '../marker.service';
import { MessageService } from '../message.service';
import { ShroomService } from '../shroom.service';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss'],
})
export class LiveFeedComponent implements OnInit {
  private messageService = inject(MessageService);
  private shroomService = inject(ShroomService);
  private markerService = inject(MarkerService);

  protected messages$ = this.messageService.messages$;
  protected mushroomData$ = this.shroomService.data$;

  ngOnInit(): void {
    this.shroomService.fetchData().subscribe((mushroomData) => {
      for (let data of mushroomData) {
        this.markerService.addMarker(
          data.latitude,
          data.longitude,
          data.mushroom
        );
      }
    });
  }
}
