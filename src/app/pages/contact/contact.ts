import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl(''),
    projectType: new FormControl('Food Delivery', [Validators.required]),
    budget: new FormControl('$5k - $10k', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  projectTypes = ['Food Delivery', 'E-Commerce', 'Marketplace', 'Custom App', 'Redesign', 'Maintenance'];
  budgets = ['$5k - $10k', '$10k - $25k', '$25k - $50k', '$50k+'];

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Project inquiry submitted:', this.contactForm.value);
      alert('Thank you for your inquiry! Our team will review your project details and get back to you within 24 hours.');
      this.contactForm.reset();
    }
  }
}
