import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgencyService } from '../../services/agency.service';
import { ServiceCard } from '../../components/service-card/service-card';
import { ProjectCard } from '../../components/project-card/project-card';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private agencyService = inject(AgencyService);
  
  services = this.agencyService.getServices();
  projects = this.agencyService.getProjects();
  testimonials = this.agencyService.getTestimonials();
}
