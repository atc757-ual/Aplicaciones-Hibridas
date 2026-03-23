import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExampleMapsPage } from './example_maps';

@NgModule({
  declarations: [ExampleMapsPage],
  imports: [CommonModule, IonicModule],
  exports: [ExampleMapsPage]
})
export class ExampleMapsPageModule {}
