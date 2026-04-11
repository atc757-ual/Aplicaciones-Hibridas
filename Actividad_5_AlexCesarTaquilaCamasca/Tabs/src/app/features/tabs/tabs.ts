import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { people, calendar, bag } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class Tabs {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ people, calendar, bag });
  }
}
