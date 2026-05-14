import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgencyService } from '../../services/agency.service';
import { ServiceCard } from '../../components/service-card/service-card';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private agencyService = inject(AgencyService);
  services = this.agencyService.getServices();
}
