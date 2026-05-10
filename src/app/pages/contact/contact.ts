import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  private route = inject(ActivatedRoute);
  private agencyService = inject(AgencyService);
  settings = this.agencyService.getSettings();
  showSuccess = signal(false);

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('+91 ', [Validators.required]),
    company: new FormControl(''),
    projectType: new FormControl('Food Delivery', [Validators.required]),
    budget: new FormControl('$5k - $10k', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  projectTypes = ['Food Delivery', 'E-Commerce', 'Marketplace', 'Custom App', 'Redesign', 'Maintenance'];
  budgets = ['$5k - $10k', '$10k - $25k', '$25k - $50k', '$50k+'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const project = params['project'];
      if (project) {
        this.contactForm.patchValue({
          message: `I am interested in a project similar to "${project}". Let's discuss how we can build something even better!`,
          projectType: this.getCategoryMatch(project)
        });
      }
    });
  }

  private getCategoryMatch(projectName: string): string {
    if (projectName.toLowerCase().includes('food')) return 'Food Delivery';
    if (projectName.toLowerCase().includes('shop')) return 'E-Commerce';
    if (projectName.toLowerCase().includes('task')) return 'Marketplace';
    return 'Custom App';
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      try {
        await this.agencyService.submitEnquiry(this.contactForm.value);
        this.showSuccess.set(true);
        this.contactForm.reset({
          projectType: 'Food Delivery',
          budget: '$5k - $10k',
          phone: '+91 '
        });
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Sorry, there was an error submitting your enquiry. Please try again later.');
      }
    }
  }

  closeSuccess() {
    this.showSuccess.set(false);
  }
}
