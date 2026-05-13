import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isScrolled = signal(false);
  isMenuOpen = signal(false);
  isLightPage = signal(false);
  private router = inject(Router);
  private agencyService = inject(AgencyService);
  
  settings = this.agencyService.getSettings();
  
  menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageState();
      this.isMenuOpen.set(false); // Force close menu on navigation
    });

    // Set initial state
    this.updatePageState();
  }

  private updatePageState() {
    // All pages now use the dark premium hero, so we don't need light page logic
    this.isLightPage.set(false);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
