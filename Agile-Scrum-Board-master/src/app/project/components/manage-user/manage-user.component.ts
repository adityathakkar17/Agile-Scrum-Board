import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType, JIssue, IssueStatus, IssuePriority } from '@trungk18/interface/issue';
import { quillConfiguration } from '@trungk18/project/config/editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { JUser } from '@trungk18/interface/user';
import { tap } from 'rxjs/operators';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { DateUtil } from '@trungk18/project/utils/date';
import { TeamMember } from '@trungk18/interface/teammember';


@Component({
  selector: 'manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

@UntilDestroy()
export class ManageUserComponent implements OnInit {
  issueForm: FormGroup;
  users: TeamMember[];

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _projectService: ProjectService,
    private _projectQuery: ProjectQuery) {}

  ngOnInit() {
    // this.initForm();
    this.getUsers();
  }

  getUsers() {
    this._projectService.getTeamMember()
      .subscribe(users => this.users = users);
  }

  editUser(user: TeamMember) {
    // Implement edit user functionality here
  }

  deleteUser(id: string) {
    // if (confirm('Are you sure you want to delete this user?')) {
      console.log(id);
      this._projectService.deleteTeamMember(id);
      return this.getUsers();

    }



  // initForm() {
  //   this.issueForm = this._fb.group({
  //     type: [IssueType.TASK],
  //     priority: [IssuePriority.MEDIUM],
  //     title: ['', NoWhitespaceValidator()],
  //     description: [''],
  //     reporterId: [''],
  //     userIds: [[]]
  //   });
  // }

  // submitForm() {
  //   if (this.issueForm.invalid) {
  //     return;
  //   }
  //   const now = DateUtil.getNow();
  //   const issue: JIssue = {
  //     ...this.issueForm.getRawValue(),
  //     id: IssueUtil.getRandomId(),
  //     status: IssueStatus.BACKLOG,
  //     createdAt: now,
  //     updatedAt: now
  //   };

  //   this._projectService.saveIssue(issue);
  //   this.closeModal();
  // }

  cancel() {
    this.closeModal();
  }

  closeModal() {
    
    this._modalRef.close();
  }
}
