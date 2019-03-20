import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class AngularMaterialModule {}
