import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Portfolio } from './pages/portfolio/portfolio';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'Stack Agency - We Build Websites That Grow Your Business' },
  { path: 'services', component: Services, title: 'Our Services | Stack Agency' },
  { path: 'portfolio', component: Portfolio, title: 'Our Portfolio | Stack Agency' },
  { path: 'about', component: About, title: 'About Us | Stack Agency' },
  { path: 'contact', component: Contact, title: 'Start Your Project | Stack Agency' },
  { path: '**', component: NotFound, title: '404 - Page Not Found | Stack Agency' }
];
