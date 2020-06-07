import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'home',
  loadChildren: './home/home.module#HomePageModule'
},
{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: 'home/confirmation',
  loadChildren: () => import('./confirmation/confirmation.module').then(m => m.ConfirmationPageModule)
},
{
  path: 'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
