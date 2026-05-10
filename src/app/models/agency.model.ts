export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'Food Delivery' | 'E-Commerce' | 'Marketplace' | 'Custom';
  description: string;
  imageUrl: string;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}
