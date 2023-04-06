import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './project/auth/auth.guard';
import { ForgotPasswordComponent } from './project/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './project/auth/login/login.component';
import { RegisterComponent } from './project/auth/register/register.component';
import { ResetPasswordComponent } from './project/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'project',
    canActivate: [AuthGuard],
    loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'wip',
    loadChildren: () =>
      import('./work-in-progress/work-in-progress.module').then(
        (m) => m.WorkInProgressModule
      )
  },
  {
    path: '',
    redirectTo: 'project',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
