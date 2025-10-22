import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserPipe } from '../../pipe/user-pipe';
import { FormValidateDirective } from 'form-validate-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../services/http';
import { SwalService } from '../../services/swal';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterLink, FormsModule, FormValidateDirective, UserPipe],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit{
users: UserModel[] = [];  
  roles: RoleModel[] = [];
  
  @ViewChild("addModalCloseBtn") addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseBtn") updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;

  createModel: UserModel = new UserModel();
  updateModel: UserModel = new UserModel();

  search: string = "";

  constructor(
    private http: Http,
    private swal: SwalService
  ){}

  ngOnInit(): void {
    this.getAll();
    this.getAllRoles();
  }

  getAll(){
    this.http.post<UserModel[]>("Users/GetAll", {}, (res)=> {
      this.users = res.data;
    });
  }

  getAllRoles(){
    this.http.post<RoleModel[]>("Users/GetAllRoles", {}, (res)=> {
      this.roles = res.data;
    });
  }
  
  add(form: NgForm){
    if(form.valid){
      this.http.post<string>("Users/Create",this.createModel,(res)=> {
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new UserModel();
      });
    }
  }

  delete(id: string, fullName: string){
    this.swal.callSwal("Delete user?",`You want to delete ${fullName}?`,()=> {
      this.http.post<string>("Users/DeleteById", {id: id}, (res)=> {
        this.swal.callToast(res.data,"info");
        this.getAll();
      })
    })
  }

  get(data: UserModel){    
    this.updateModel = {...data};    
  }

  update(form:NgForm){
    if(form.valid){
      this.http.post<string>("Users/Update",this.updateModel,(res)=> {
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();        
      });
    }
  }
}