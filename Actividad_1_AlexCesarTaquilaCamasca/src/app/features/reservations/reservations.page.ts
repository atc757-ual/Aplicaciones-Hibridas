import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { IonContent,IonIcon,IonFab, IonFabButton,IonButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplaneOutline, ticket, airplane, add, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderAppComponent } from '../../shared/components/header-app/header-app.component';
import { Reservation, ReservationsService } from '../../core/services/reservations.service';
import { NavController } from '@ionic/angular/standalone';

addIcons({
  'airplane-outline': airplaneOutline,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  ticket,
  airplane,
  add,
});

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonFab,
    IonFabButton,
    NgFor,
    NgIf,
    DatePipe,
    AsyncPipe,
    HeaderAppComponent,
  ],
})
export class ReservationsPage {
  protected readonly reservations$ = this.reservationsService.reservations$;
  protected readonly expandedReservationIds = new Set<number>();
  protected isFabMenuOpen = false;
  protected isPastReservationsVisible = false;

  constructor(
    private readonly reservationsService: ReservationsService,
    private navCtrl: NavController
  ) {
    addIcons({ airplaneOutline, ticket, airplane, add, eyeOutline, eyeOffOutline });
  }

  protected toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  protected goToCreateReservation(): void {
    // Quitar el foco del elemento activo antes de navegar para evitar advertencias de aria-hidden
    if (document && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    };
    this.isFabMenuOpen = false;
    this.navCtrl.navigateForward('/reservations/new');
  }

  protected toggleReservationCard(reservationId: number): void {
    if (this.expandedReservationIds.has(reservationId)) {
      this.expandedReservationIds.delete(reservationId);
      return;
    }

    this.expandedReservationIds.add(reservationId);
  }

  protected isReservationExpanded(reservationId: number): boolean {
    return this.expandedReservationIds.has(reservationId);
  }

  protected getCardAccentColor(reservation: Reservation): string {
    const dayDiff = this.getTravelDayDiff(reservation.fechaViaje);
    if (dayDiff === null) {
      return 'var(--color-info)';
    }

    if (dayDiff < 0) {
      return 'var(--color-error)';
    }

    if (dayDiff <= 30) {
      return 'var(--color-info)';
    }

    return 'var(--color-success)';
  }

  protected getReservationStatusLabel(reservation: Reservation): string {
    const dayDiff = this.getTravelDayDiff(reservation.fechaViaje);
    if (dayDiff === null) {
      return 'Próximo';
    }

    if (dayDiff < 0) {
      return 'Realizado';
    }

    if (dayDiff <= 30) {
      return 'Próximo';
    }

    return 'Confirmado';
  }

  protected getUpcomingReservations(reservations: Reservation[]): Reservation[] {
    return reservations
      .filter((reservation) => {
        const dayDiff = this.getTravelDayDiff(reservation.fechaViaje);
        return dayDiff === null || dayDiff >= 0;
      })
      .sort((a, b) => this.getDateSortValue(a.fechaViaje) - this.getDateSortValue(b.fechaViaje));
  }

  protected getPastReservations(reservations: Reservation[]): Reservation[] {
    return reservations
      .filter((reservation) => {
        const dayDiff = this.getTravelDayDiff(reservation.fechaViaje);
        return dayDiff !== null && dayDiff < 0;
      })
      .sort((a, b) => this.getDateSortValue(b.fechaViaje) - this.getDateSortValue(a.fechaViaje));
  }

  protected togglePastReservations(): void {
    this.isPastReservationsVisible = !this.isPastReservationsVisible;
  }

  private getDateSortValue(rawDate: string): number {
    const parsed = this.parseDateOnly(rawDate);
    return parsed ? parsed.getTime() : Number.MAX_SAFE_INTEGER;
  }

  private getTravelDayDiff(rawDate: string): number | null {
    const travelDate = this.parseDateOnly(rawDate);
    if (!travelDate) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((travelDate.getTime() - today.getTime()) / msPerDay);
  }

  private parseDateOnly(rawDate: string): Date | null {
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
      const [day, month, year] = rawDate.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    return null;
  }

  protected calculateDuration(horaSalida: string, horaLlegada: string): string {
    const [hS, mS] = horaSalida.split(':').map(Number);
    const [hL, mL] = horaLlegada.split(':').map(Number);
    const minutesDiff = hL * 60 + mL - (hS * 60 + mS);
    const hours = Math.floor(minutesDiff / 60);
    const mins = minutesDiff % 60;
    return `${hours}h ${mins}m`;
  }
}
