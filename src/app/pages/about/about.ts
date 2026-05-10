import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private agencyService = inject(AgencyService);
  team = this.agencyService.getTeam();

  teamColors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ];

  brokenImages = new Set<string>();

  onImageError(event: Event, memberName: string) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    this.brokenImages.add(memberName);
  }

  isImageBroken(name: string): boolean {
    return this.brokenImages.has(name);
  }
}
