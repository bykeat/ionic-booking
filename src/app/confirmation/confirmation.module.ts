import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfirmationPageRoutingModule } from './confirmation-routing.module';
import { ConfirmationPage } from './confirmation.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmationPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [ConfirmationPage]
})
export class ConfirmationPageModule { }
