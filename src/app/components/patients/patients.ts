import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PatientModel } from '../../models/patient.model';
import { Http } from '../../services/http';
import { Router, RouterLink } from '@angular/router';
import { SwalService } from '../../services/swal';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidateDirective } from 'form-validate-angular';
import { PatientPipe } from '../../pipe/patient-pipe';

@Component({
  selector: 'app-patient',
  imports: [CommonModule, RouterLink, FormsModule, FormValidateDirective, PatientPipe],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  patients: PatientModel[] = [];

  @ViewChild('addModalCloseBtn') addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;

  createModel: PatientModel = new PatientModel();
  updateModel: PatientModel = new PatientModel();

  search: string = '';
  constructor(
    private http: Http,
    private router: Router,
    private swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.http.post<PatientModel[]>(
      'Patients/GetAll',
      {},
      (res) => {
        this.patients = res.data ?? [];
      },
      (err) => {
        if (err.status === 401) {
          console.error('Unauthorized! Token geçersiz veya süresi dolmuş.');
          this.router.navigateByUrl('/login');
        } else {
          console.error('Patients fetch error:', err);
        }
      },
    );
  }

  add(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Patients/Create', this.createModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new PatientModel();
      });
    }
  }
  delete(id: string, fullName: string) {
    this.swal.callSwal('Delete patient?', `You want to delete ${fullName}?`, () => {
      this.http.post<string>('Patients/Delete', { id: id }, (res) => {
        this.swal.callToast(res.data, 'info');
        this.getAll();
      });
    });
  }

  get(data: PatientModel) {
    this.updateModel = { ...data };
  }

  update(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Patients/Update', this.updateModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      });
    }
  }
}
