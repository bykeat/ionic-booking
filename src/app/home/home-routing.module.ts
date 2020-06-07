import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ConfirmationPage } from '../confirmation/confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  // {
  //   path: 'confirmations',
  //   component: ConfirmationPage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
