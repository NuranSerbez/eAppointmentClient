import { Component } from '@angular/core';
import { departments } from '../../constants';
import { DoctorModel } from '../../models/doctor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { Http } from '../../services/http';
import { AppointmentModel } from '../../models/appointment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, DxSchedulerModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  departments = departments;
  doctors: DoctorModel[] = [];

  selectedDepartmentValue: number = 0;
  selectedDoctorId: string = "";

  appointments: any = [
    {
      startDate: new Date("2024-04-11 09:00"),
      endDate: new Date("2024-04-11 09:30"),
      title: "Nuran Serbez",
    },
    {
      startDate: new Date("2024-04-11 10:00"),
      endDate: new Date("2024-04-11 10:30"),
      title: "Nuran Serbez",
    },
    {
      startDate: new Date("2024-04-11 11:00"),
      endDate: new Date("2024-04-11 11:30"),
      title: "Nuran Serbez",
    },
  ];

 constructor(
    private http: Http
  ){}

  getAllDoctor(){
    this.selectedDoctorId = "";
    if(this.selectedDepartmentValue > 0){
      this.http.post<DoctorModel[]>("Appointments/GetAllDoctorByDepartment", 
            {departmentValue: +this.selectedDepartmentValue}, (res)=> {
        this.doctors = res.data;
      });
    }
  }

  getAllAppointments(){
    if(this.selectedDoctorId){
      this.http.post<AppointmentModel[]>("Appointments/GetAllByDoctorId", 
            {doctorId: this.selectedDoctorId}, (res)=> {
        this.appointments = res.data;
      });
    }
  }
}