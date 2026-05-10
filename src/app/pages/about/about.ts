import { Component, inject } from '@angular/core';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private agencyService = inject(AgencyService);
  team = this.agencyService.getTeam();
}
