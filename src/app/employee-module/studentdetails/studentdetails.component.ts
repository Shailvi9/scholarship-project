import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeserviceService } from 'src/app/Services/employeeService/employeeservice.service';
import { saveAs } from 'file-saver';
const MIME_TYPES = {
  PDF: 'application/pdf',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {

  x:any;
  stuid:any;
  constructor(private empserve:EmployeeserviceService,private aroute:ActivatedRoute,private route:Router) { 
    this.stuid=this.aroute.snapshot.params['id'];
    this.fulldetails();
  }

  ngOnInit(): void {
  }
  private fulldetails()
  {
    this.empserve.getDocumentById(this.stuid).subscribe(data=>{console.log(data),this.x=data});
  }
  public approve(x:any)
  {
    
    this.empserve.approveStatus(x.application_details.appId,x).subscribe(data=>this.x=data);
    window.alert("REQUEST APPROVED !!!");
    this.route.navigate(['student/requests']);
  }
  public reject(x:any)
  {
    this.empserve.rejectStatus(x.application_details.appId,x).subscribe(data=>this.x=data);
    window.alert("REQUEST REJECTED !!!");
    this.route.navigate(['student/requests']);
  }
  
  verify(appId:any){
    console.log(appId);
    this.empserve.downloadType(appId).subscribe(
      (response:any) => {
        console.log(response.documentType);
        this.empserve.downloadFile(appId).subscribe(
          (data:any) => {
            saveAs(new Blob([data], {type: MIME_TYPES[response.documentType as keyof typeof MIME_TYPES]}), response.documentName);
          },
          (error:any) => {
            console.log(error.status);
          }
        );
      },
      (error:any) => {
          console.log(error.status);
        }
    );
  }

}
