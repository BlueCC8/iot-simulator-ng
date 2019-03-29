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
  MatMenuModule,
  MatSidenavModule,
  MatRadioModule,
  MatListModule,
  MatTreeModule
} from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';

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
    MatMenuModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatTreeModule,
    MatListModule
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
    MatMenuModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatTreeModule,
    MatListModule
  ]
})
export class AngularMaterialModule {}
