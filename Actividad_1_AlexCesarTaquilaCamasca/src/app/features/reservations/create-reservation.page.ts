import { Component } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplaneOutline, chevronDownOutline, checkmarkOutline } from 'ionicons/icons';
import { HeaderAppComponent } from '../../shared/components/header-app/header-app.component';
import { NewReservationInput, ReservationsService } from '../../core/services/reservations.service';

interface FlightOption {
  id: string;
  label: string;
  origen: string;
  destino: string;
  codIataOrigen: string;
  codIataDestino: string;
  aerolinea: string;
  fechaViaje: string;
  horaSalida: string;
  horaLlegada: string;
}

interface FlightPreviewModel {
  codIataOrigen: string;
  codIataDestino: string;
  origen: string;
  destino: string;
  horaSalida: string;
  horaLlegada: string;
  aerolinea: string;
  fechaViaje: string;
}

type ReservationSelectorField = 'origen' | 'destino';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    DatePipe,
    IonIcon,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    HeaderAppComponent,
  ],
})
export class CreateReservationPage {
  protected readonly flightOptions: FlightOption[] = [
    {
      id: 'IB3412',
      label: 'IB3412 - Madrid -> Barcelona',
      origen: 'Madrid',
      destino: 'Barcelona',
      codIataOrigen: 'MAD',
      codIataDestino: 'BCN',
      aerolinea: 'Iberia',
      fechaViaje: '2026-04-11',
      horaSalida: '09:05',
      horaLlegada: '10:20',
    },
    {
      id: 'AV9541',
      label: 'AV9541 - Bogota -> Medellin',
      origen: 'Bogota',
      destino: 'Medellin',
      codIataOrigen: 'BOG',
      codIataDestino: 'MDE',
      aerolinea: 'Avianca',
      fechaViaje: '2026-04-16',
      horaSalida: '13:05',
      horaLlegada: '14:02',
    },
    {
      id: 'LA2023',
      label: 'LA2023 - Lima -> Cusco',
      origen: 'Lima',
      destino: 'Cusco',
      codIataOrigen: 'LIM',
      codIataDestino: 'CUZ',
      aerolinea: 'LATAM',
      fechaViaje: '2026-04-21',
      horaSalida: '06:40',
      horaLlegada: '08:05',
    },
    {
      id: 'UX5018',
      label: 'UX5018 - Madrid -> Paris',
      origen: 'Madrid',
      destino: 'Paris',
      codIataOrigen: 'MAD',
      codIataDestino: 'CDG',
      aerolinea: 'Air Europa',
      fechaViaje: '2026-04-18',
      horaSalida: '11:10',
      horaLlegada: '13:15',
    },
    {
      id: 'IB6621',
      label: 'IB6621 - Barcelona -> Roma',
      origen: 'Barcelona',
      destino: 'Roma',
      codIataOrigen: 'BCN',
      codIataDestino: 'FCO',
      aerolinea: 'Iberia',
      fechaViaje: '2026-04-24',
      horaSalida: '07:50',
      horaLlegada: '09:40',
    },
    {
      id: 'AV1204',
      label: 'AV1204 - Bogota -> Cartagena',
      origen: 'Bogota',
      destino: 'Cartagena',
      codIataOrigen: 'BOG',
      codIataDestino: 'CTG',
      aerolinea: 'Avianca',
      fechaViaje: '2026-04-19',
      horaSalida: '15:20',
      horaLlegada: '16:52',
    },
    {
      id: 'LA4517',
      label: 'LA4517 - Lima -> Santiago',
      origen: 'Lima',
      destino: 'Santiago',
      codIataOrigen: 'LIM',
      codIataDestino: 'SCL',
      aerolinea: 'LATAM',
      fechaViaje: '2026-04-27',
      horaSalida: '14:35',
      horaLlegada: '19:05',
    },
    {
      id: 'CM284',
      label: 'CM284 - Panama -> San Jose',
      origen: 'Panama',
      destino: 'San Jose',
      codIataOrigen: 'PTY',
      codIataDestino: 'SJO',
      aerolinea: 'Copa Airlines',
      fechaViaje: '2026-04-29',
      horaSalida: '08:25',
      horaLlegada: '09:42',
    },
    {
      id: 'AR1362',
      label: 'AR1362 - Buenos Aires -> Mendoza',
      origen: 'Buenos Aires',
      destino: 'Mendoza',
      codIataOrigen: 'AEP',
      codIataDestino: 'MDZ',
      aerolinea: 'Aerolineas Argentinas',
      fechaViaje: '2026-05-03',
      horaSalida: '10:15',
      horaLlegada: '12:00',
    },
    {
      id: 'AM611',
      label: 'AM611 - Ciudad de Mexico -> Cancun',
      origen: 'Ciudad de Mexico',
      destino: 'Cancun',
      codIataOrigen: 'MEX',
      codIataDestino: 'CUN',
      aerolinea: 'Aeromexico',
      fechaViaje: '2026-05-07',
      horaSalida: '09:45',
      horaLlegada: '12:10',
    },
  ];

  protected readonly form: ReturnType<FormBuilder['group']>;
  protected readonly minTravelDate = this.getTomorrowDateInput();
  protected openSelector: ReservationSelectorField | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly reservationsService: ReservationsService,
  ) {
    this.form = this.fb.group({
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      fechaViaje: ['', [Validators.required]],
    });
    addIcons({
      chevronDownOutline,
      checkmarkOutline,
      airplaneOutline,
    });
  }

  protected get hasFlightSelection(): boolean {
    return Boolean(
      this.form.controls['origen'].value
      && this.form.controls['destino'].value
      && this.form.controls['fechaViaje'].value,
    );
  }

  private getTomorrowDateInput(): string {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.formatDateForInput(tomorrow);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected get originOptions(): string[] {
    return [...new Set(this.flightOptions.map((flight) => flight.origen))];
  }

  protected get destinationOptions(): string[] {
    const selectedOrigin = this.form.controls['origen'].value;
    const flights = selectedOrigin
      ? this.flightOptions.filter((flight) => flight.origen === selectedOrigin)
      : this.flightOptions;

    return [...new Set(flights.map((flight) => flight.destino))];
  }

  protected get dateOptions(): string[] {
    const selectedOrigin = this.form.controls['origen'].value;
    const selectedDestination = this.form.controls['destino'].value;

    const flights = this.flightOptions.filter((flight) => {
      const matchesOrigin = selectedOrigin ? flight.origen === selectedOrigin : true;
      const matchesDestination = selectedDestination ? flight.destino === selectedDestination : true;
      return matchesOrigin && matchesDestination;
    });

    return [...new Set(flights.map((flight) => flight.fechaViaje))];
  }

  protected isSelectorOpen(field: ReservationSelectorField): boolean {
    return this.openSelector === field;
  }

  protected toggleSelector(field: ReservationSelectorField): void {
    if (field === 'destino' && !this.form.controls['origen'].value) {
      return;
    }

    this.openSelector = this.openSelector === field ? null : field;
  }

  protected selectOrigin(value: string): void {
    this.form.controls['origen'].setValue(value);
    this.form.controls['destino'].setValue('');
    this.form.controls['fechaViaje'].setValue('');
    this.openSelector = 'destino';
  }

  protected selectDestination(value: string): void {
    this.form.controls['destino'].setValue(value);
    this.form.controls['fechaViaje'].setValue('');
    this.openSelector = null;
  }

  protected get selectedFlight(): FlightOption | undefined {
    const selectedOrigin = this.form.controls['origen'].value;
    const selectedDestination = this.form.controls['destino'].value;
    const selectedDate = this.form.controls['fechaViaje'].value;

    return this.flightOptions.find(
      (flight) =>
        flight.origen === selectedOrigin
        && flight.destino === selectedDestination
        && flight.fechaViaje === selectedDate,
    );
  }

  protected get previewFlight(): FlightPreviewModel | null {
    if (!this.hasFlightSelection) {
      return null;
    }

    if (this.selectedFlight) {
      return this.selectedFlight;
    }

    const selectedOrigin = this.form.controls['origen'].value as string;
    const selectedDestination = this.form.controls['destino'].value as string;
    const selectedDate = this.form.controls['fechaViaje'].value as string;
    const routeFlight = this.flightOptions.find(
      (flight) => flight.origen === selectedOrigin && flight.destino === selectedDestination,
    );

    return {
      codIataOrigen: routeFlight?.codIataOrigen ?? this.getIataCode(selectedOrigin, 'origen'),
      codIataDestino: routeFlight?.codIataDestino ?? this.getIataCode(selectedDestination, 'destino'),
      origen: selectedOrigin,
      destino: selectedDestination,
      horaSalida: routeFlight?.horaSalida ?? '09:00',
      horaLlegada: routeFlight?.horaLlegada ?? '10:45',
      aerolinea: routeFlight?.aerolinea ?? 'Aerolínea sugerida',
      fechaViaje: selectedDate,
    };
  }

  private getIataCode(city: string, type: 'origen' | 'destino'): string {
    const match = this.flightOptions.find((flight) => flight[type] === city);
    if (!match) {
      return '---';
    }

    return type === 'origen' ? match.codIataOrigen : match.codIataDestino;
  }

  protected getFlightDuration(flight: Pick<FlightPreviewModel, 'horaSalida' | 'horaLlegada'>): string {
    const [departureHour, departureMinutes] = flight.horaSalida.split(':').map(Number);
    const [arrivalHour, arrivalMinutes] = flight.horaLlegada.split(':').map(Number);

    if (
      Number.isNaN(departureHour)
      || Number.isNaN(departureMinutes)
      || Number.isNaN(arrivalHour)
      || Number.isNaN(arrivalMinutes)
    ) {
      return 'Por confirmar';
    }

    const totalMinutes = arrivalHour * 60 + arrivalMinutes - (departureHour * 60 + departureMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const selectedFlight = this.selectedFlight;
    const previewFlight = this.previewFlight;

    if (!selectedFlight && !previewFlight) {
      return;
    }

    const flightData = selectedFlight ?? {
      id: `SV-${Date.now().toString().slice(-6)}`,
      codIataOrigen: previewFlight!.codIataOrigen,
      codIataDestino: previewFlight!.codIataDestino,
      origen: previewFlight!.origen,
      destino: previewFlight!.destino,
      aerolinea: previewFlight!.aerolinea,
      fechaViaje: previewFlight!.fechaViaje,
      horaSalida: previewFlight!.horaSalida,
      horaLlegada: previewFlight!.horaLlegada,
    };

    const payload: NewReservationInput = {
      origen: flightData.origen,
      destino: flightData.destino,
      CodIataOrigen: flightData.codIataOrigen,
      CodIataDestino: flightData.codIataDestino,
      numeroVuelo: flightData.id,
      aerolinea: flightData.aerolinea,
      fechaViaje: flightData.fechaViaje,
      horaSalida: flightData.horaSalida,
      horaLlegada: flightData.horaLlegada,
    };

    this.reservationsService.addReservation(payload);
    this.router.navigate(['/reservations']);
  }
}
