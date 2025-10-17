import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../services/http';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from '../../constants';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { from } from 'rxjs';
import { SwalService } from '../../services/swal';
import { DoctorPipe } from '../../pipe/doctor-pipe';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FormValidateDirective, DoctorPipe],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css'],
})
export class Doctors implements OnInit {
  doctors: DoctorModel[] = [];
  departments = departments;

  @ViewChild('addModalCloseBtn') addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;

  createModel: DoctorModel = new DoctorModel();
  updateModel: DoctorModel = new DoctorModel();

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
    this.http.post<DoctorModel[]>(
      'Doctors/GetAll',
      {},
      (res) => {
        this.doctors = res.data ?? [];
      },
      (err) => {
        if (err.status === 401) {
          console.error('Unauthorized! Token geçersiz veya süresi dolmuş.');
          this.router.navigateByUrl('/login');
        } else {
          console.error('Doctors fetch error:', err);
        }
      },
    );
  }
  add(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Doctors/Create', this.createModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new DoctorModel();
      });
    }
  }
  delete(id: string, fullName: string) {
    this.swal.callSwal('Delete doctor?', `You want to delete ${fullName}?`, () => {
      this.http.post<string>('Doctors/Delete', { id: id }, (res) => {
        this.swal.callToast(res.data, 'info');
        this.getAll();
      });
    });
  }

  get(data: DoctorModel) {
    this.updateModel = { ...data };
    this.updateModel.departmentValue = data.department.value;
  }

  update(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Doctors/Update', this.updateModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      });
    }
  }
}
