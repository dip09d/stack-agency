import { Injectable, signal } from '@angular/core';
import { Service, Project, TeamMember, Testimonial } from '../models/agency.model';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
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
      description: 'A comprehensive food delivery ecosystem for urban markets.',
      imageUrl: 'assets/images/project-foodie.png'
    },
    {
      id: 'shopflow',
      name: 'ShopFlow',
      category: 'E-Commerce',
      description: 'A high-performance online store for a global fashion brand.',
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

  private team = signal<TeamMember[]>([
    { name: 'Alex Rivers', role: 'Founder & CEO', imageUrl: 'assets/images/team-1.png' },
    { name: 'Sam Chen', role: 'Head of Design', imageUrl: 'assets/images/team-2.png' },
    { name: 'Jordan Smith', role: 'Lead Developer', imageUrl: 'assets/images/team-3.png' },
    { name: 'Taylor Lee', role: 'Project Manager', imageUrl: 'assets/images/team-4.png' }
  ]);

  private testimonials = signal<Testimonial[]>([
    { quote: "Stack turned our vision into a high-converting reality. Their food delivery platform is top-notch.", author: "Sarah Miller", role: "CEO at TastyExpress" },
    { quote: "The most professional agency we've worked with. ShopFlow has doubled our online sales.", author: "James Wilson", role: "E-commerce Manager at Trendify" },
    { quote: "Their marketplace solution is robust and intuitive. Exactly what we needed for TaskConnect.", author: "Emily Chen", role: "Founder at TaskConnect" }
  ]);

  getServices() { return this.services.asReadonly(); }
  getProjects() { return this.projects.asReadonly(); }
  getTeam() { return this.team.asReadonly(); }
  getTestimonials() { return this.testimonials.asReadonly(); }
}
