import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service, Project, TeamMember, Testimonial } from '../models/agency.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8001/api';

  // These are kept STATIC as requested
  private services = signal<Service[]>([
    {
      id: 'food-delivery',
      title: 'Food Delivery Websites',
      description: 'Custom restaurant ordering systems with delivery tracking and rider applications.',
      features: ['Real-time Tracking', 'Payment Integration', 'Rider Management'],
      icon: 'restaurant',
      imageUrl: 'assets/images/service-food.png'
    },
    {
      id: 'e-commerce',
      title: 'E-Commerce Websites',
      description: 'Scalable online stores with advanced product catalogs and seamless checkout flows.',
      features: ['Inventory Management', 'Multiple Payment Gateways', 'Customer Analytics'],
      icon: 'shopping_cart',
      imageUrl: 'assets/images/service-ecommerce.png'
    },
    {
      id: 'marketplace',
      title: 'Service Marketplaces',
      description: 'Platform connecting customers with service professionals, inspired by MyBuilder.',
      features: ['Bidding System', 'Review & Ratings', 'Secure Escrow'],
      icon: 'handyman',
      imageUrl: 'assets/images/service-marketplace.png'
    },
    {
      id: 'custom-apps',
      title: 'Custom Web Applications',
      description: 'Tailored digital solutions built from the ground up for your unique business needs.',
      features: ['Modern Tech Stack', 'Cloud Infrastructure', 'Scalable Architecture'],
      icon: 'code',
      imageUrl: 'assets/images/service-custom.png'
    }
  ]);

  private projects = signal<Project[]>([
    {
      id: 'foodiedash',
      name: 'FoodieDash',
      category: 'Food Delivery',
      description: 'The gold standard of food delivery, featuring gourmet meals and lightning-fast tracking.',
      imageUrl: 'assets/images/project-foodie.png'
    },
    {
      id: 'soumyawear',
      name: 'SoumyaWear',
      category: 'E-Commerce',
      description: 'A premium fashion destination featuring high-performance checkout and a sophisticated product catalog.',
      imageUrl: 'assets/images/project-shop.png'
    },
    {
      id: 'taskconnect',
      name: 'TaskConnect',
      category: 'Marketplace',
      description: 'Connecting homeowners with verified local tradespeople.',
      imageUrl: 'assets/images/project-task.png'
    }
  ]);

  // These are DYNAMIC as requested
  private team = signal<TeamMember[]>([]);
  private settings = signal<Record<string, string>>({
    phone: '+91 98765 43210',
    email: 'soumyadip20y@gmail.com',
    address: 'Silicon Valley, CA'
  });

  private testimonials = signal<Testimonial[]>([
    { quote: "Stack turned our vision into a high-converting reality. Their food delivery platform is top-notch.", author: "Sarah Miller", role: "CEO at TastyExpress" },
    { quote: "The most professional agency we've worked with. SoumyaWear has doubled our online sales.", author: "James Wilson", role: "E-commerce Manager at Trendify" },
    { quote: "Their marketplace solution is robust and intuitive. Exactly what we needed for TaskConnect.", author: "Emily Chen", role: "Founder at TaskConnect" }
  ]);

  constructor() {
    this.loadInitialData();
  }

  private async loadInitialData() {
    try {
      const [teamData, settingsData] = await Promise.all([
        firstValueFrom(this.http.get<TeamMember[]>(`${this.apiUrl}/team`)),
        firstValueFrom(this.http.get<Record<string, string>>(`${this.apiUrl}/settings`))
      ]);

      if (teamData.length) this.team.set(teamData);
      if (Object.keys(settingsData).length) this.settings.set(settingsData);
    } catch (error) {
      console.warn('Backend not reachable, using static fallbacks for team/settings.', error);
      // Initialize with default team if API fails and team is empty
      if (this.team().length === 0) {
        this.team.set([
          { name: 'Soumyadip Das', role: 'Full-Stack Developer', imageUrl: 'assets/images/team-1.png' },
          { name: 'Sourav Pradhan', role: 'Frontend Architect', imageUrl: 'assets/images/team-2.png' },
          { name: 'Rahul Sen', role: 'Backend Engineer', imageUrl: 'assets/images/team-3.png' },
          { name: 'Moin Alam', role: 'DevOps Specialist', imageUrl: 'assets/images/team-4.png' }
        ]);
      }
    }
  }

  async submitEnquiry(enquiry: any) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/enquiries`, enquiry));
  }

  getServices() { return this.services.asReadonly(); }
  getProjects() { return this.projects.asReadonly(); }
  getTeam() { return this.team.asReadonly(); }
  getSettings() { return this.settings.asReadonly(); }
  getTestimonials() { return this.testimonials.asReadonly(); }
}
