import { Component, input } from '@angular/core';
import { Service } from '../../models/agency.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard {
  service = input.required<Service>();
}
