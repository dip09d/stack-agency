import { Component, inject, signal, computed } from '@angular/core';
import { AgencyService } from '../../services/agency.service';
import { ProjectCard } from '../../components/project-card/project-card';

@Component({
  selector: 'app-portfolio',
  imports: [ProjectCard],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  private agencyService = inject(AgencyService);
  projects = this.agencyService.getProjects();
  
  categories = ['All', 'Food Delivery', 'E-Commerce', 'Marketplace', 'Custom'] as const;
  selectedCategory = signal<typeof this.categories[number]>('All');

  filteredProjects = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') return this.projects();
    return this.projects().filter(p => p.category === selected);
  });

  setCategory(category: typeof this.categories[number]) {
    this.selectedCategory.set(category);
  }
}
