import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';
import { JComment } from '@trungk18/interface/comment';
import { JIssue } from '@trungk18/interface/issue';
import { JProject } from '@trungk18/interface/project';
import { JUser } from '@trungk18/interface/user';
import { DateUtil } from '@trungk18/project/utils/date';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProjectStore } from './project.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;
  saveIssueUrl:string;
  getIssueUrl:string;
  updateIssueUrl:string;
  deleteIssueUrl:string;
  isSaved:boolean;
  users:JUser[]=[
    {
      id: "640a18f8d589ffa80ae530a5",
      name: "Aditya",
      avatarUrl:"",
      email:"",
      password:"",
      createdAt:"",
      updatedAt:"",
      issueIds:[]
    }
  ]
  project=<JProject>{};
  constructor(private _http: HttpClient, private _store: ProjectStore) {
    this.baseUrl = environment.apiUrl;
    this.saveIssueUrl =  "http://localhost:3000/api/saveIssues";
    this.updateIssueUrl =  "http://localhost:3000/api/updateIssue";
    this.deleteIssueUrl =  "http://localhost:3000/api/deleteIssue";
    this.getIssueUrl =  "http://localhost:3000/api/jissues";
    this.isSaved=false;
  }

  setLoading(isLoading: boolean) {
    this._store.setLoading(isLoading);
  }
  getIssues()
  {
    const userId=localStorage.getItem('userId');
    return this._http.get<JIssue[]>((`${this.getIssueUrl}/${userId}`));
  }
  getProject() {
    
    
    this.getIssues().subscribe((response)=>{
      this.project.users= this.users;
      this.project.issues=response;
      console.log(this.project);
      this._store.update((state) => ({
        ...state,
        ...this.project
      }));
    })
    // this._http
    //   .get<JProject>(`${this.getIssueUrl}/${userId}`)
    //   .pipe(
    //     setLoading(this._store),
    //     tap((project) => {
    //       this._store.update((state) => ({
    //           ...state,
    //           ...project
    //         }));
    //     }),
    //     catchError((error) => {
    //       this._store.setError(error);
    //       return of(error);
    //     })
    //   )
    //   .subscribe();
  }

  updateProject(project: Partial<JProject>) {
    this._store.update((state) => ({
      ...state,
      ...project
    }));
  }

  saveIssue(issue: JIssue) {
    issue.updatedAt = DateUtil.getNow();
    
      var issues=this._store.getValue().issues;
      issue.listPosition=issues.length+1;
      console.log(issue);
      
      this._http.post(this.saveIssueUrl, {'userId':localStorage.getItem('userId'),issue})
      .toPromise()
      .then((response) => {
        // Upsert the item in the collection
        console.log("inside update" );
       this.getIssues().subscribe((response)=>{
          this.project.users= this.users;
          this.project.issues=response;
          console.log(this.project);
          this._store.update((state) => ({
            ...state,
            ...this.project
          }));
      });
    });
    
  }
  updateIssue(issue: JIssue) {
    issue.updatedAt = DateUtil.getNow();
    
      // var issues=this._store.getValue().issues;
      // issue.listPosition=issues.length+1;
      console.log(issue);
      
      this._http.post(this.updateIssueUrl, {issue})
      .toPromise()
      .then((response) => {
        // Upsert the item in the collection
        console.log("inside update" );
       this.getIssues().subscribe((response)=>{
          this.project.users= this.users;
          this.project.issues=response;
          console.log(this.project);
          this._store.update((state) => ({
            ...state,
            ...this.project
          }));
      });
    });
  }
  // deleteIssue(issueId: string) {
  //   this._store.update((state) => {
  //     const issues = arrayRemove(state.issues, issueId);
  //     return {
  //       ...state,
  //       issues
  //     };
  //   });
  // }
  deleteIssue(issueId: string) {
    // send a DELETE request to the server to delete the issue with the specified issueId
    console.log("inside del");
    this._http.delete(`${this.deleteIssueUrl}/${issueId}`)
      .toPromise()
      .then((response) => {
        // if the request was successful, update the state to remove the deleted issue
        this.getIssues().subscribe((response)=>{
          this.project.users= this.users;
          this.project.issues=response;
          console.log(this.project);
          this._store.update((state) => ({
            ...state,
            ...this.project
          }));
        })
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  updateIssueComment(issueId: string, comment: JComment) {
    const allIssues = this._store.getValue().issues;
    const issue = allIssues.find((x) => x._id === issueId);
    if (!issue) {
      return;
    }

    const comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
    this.updateIssue({
      ...issue,
      comments
    });
  }
}
