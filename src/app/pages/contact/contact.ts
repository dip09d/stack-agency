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
  isLoading = signal(false);

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    countryCode: new FormControl('+91', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]),
    company: new FormControl(''),
    projectType: new FormControl('Food Delivery', [Validators.required]),
    budget: new FormControl('$5k - $10k', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  ];

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
    if (this.contactForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      try {
        const formData = {
          ...this.contactForm.value,
          phone: `${this.contactForm.value.countryCode} ${this.contactForm.value.phone}`
        };
        delete (formData as any).countryCode;

        await this.agencyService.submitEnquiry(formData);
        this.showSuccess.set(true);
        this.contactForm.reset({
          projectType: 'Food Delivery',
          budget: '$5k - $10k',
          countryCode: '+91',
          phone: ''
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          this.showSuccess.set(false);
        }, 5000);
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Sorry, there was an error submitting your enquiry. Please try again later.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  closeSuccess() {
    this.showSuccess.set(false);
  }
}
