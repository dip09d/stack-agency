import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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
    const url = this.router.url;
    // About and Portfolio have light/white heroes, so they need a dark header
    this.isLightPage.set(url.includes('/about') || url.includes('/portfolio'));
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
