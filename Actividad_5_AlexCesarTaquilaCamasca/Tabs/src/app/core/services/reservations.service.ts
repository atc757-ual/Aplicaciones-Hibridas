import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Reservation {
  id: number;
  origen: string;
  destino: string;
  CodIataOrigen: string;
  CodIataDestino: string;
  numeroReserva: string;
  numeroVuelo: string;
  aerolinea: string;
  fechaViaje: string;
  horaSalida: string;
  horaLlegada: string;
}

export interface NewReservationInput {
  origen: string;
  destino: string;
  CodIataOrigen: string;
  CodIataDestino: string;
  numeroVuelo: string;
  aerolinea: string;
  fechaViaje: string;
  horaSalida: string;
  horaLlegada: string;
}

const RESERVATIONS_STORAGE_KEY = 'reservations-data';

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    origen: 'Madrid',
    destino: 'Barcelona',
    CodIataOrigen: 'MAD',
    CodIataDestino: 'BCN',
    numeroReserva: 'RSV-8K21Q',
    numeroVuelo: 'IB3412',
    aerolinea: 'Iberia',
    fechaViaje: '2026-03-21',
    horaSalida: '08:15',
    horaLlegada: '09:30',
  },
  {
    id: 2,
    origen: 'Santiago',
    destino: 'Lima',
    CodIataOrigen: 'SCL',
    CodIataDestino: 'LIM',
    numeroReserva: 'RSV-1A77N',
    numeroVuelo: 'LA2403',
    aerolinea: 'LATAM',
    fechaViaje: '2026-03-05',
    horaSalida: '10:40',
    horaLlegada: '12:25',
  },
  {
    id: 3,
    origen: 'Quito',
    destino: 'Panama',
    CodIataOrigen: 'UIO',
    CodIataDestino: 'PTY',
    numeroReserva: 'RSV-9Z31K',
    numeroVuelo: 'CM153',
    aerolinea: 'Copa Airlines',
    fechaViaje: '2026-05-20',
    horaSalida: '07:20',
    horaLlegada: '09:15',
  },
];

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly reservationsSubject = new BehaviorSubject<Reservation[]>(this.loadReservations());

  readonly reservations$ = this.reservationsSubject.asObservable();

  addReservation(input: NewReservationInput): void {
    const current = this.reservationsSubject.value;
    const nextId = current.length > 0 ? Math.max(...current.map((item) => item.id)) + 1 : 1;
    const reservation: Reservation = {
      ...input,
      id: nextId,
      numeroReserva: this.generateReservationCode(),
    };

    const next = [...current, reservation];
    this.reservationsSubject.next(next);
    this.saveReservations(next);
  }

  private loadReservations(): Reservation[] {
    if (typeof localStorage === 'undefined') {
      return INITIAL_RESERVATIONS;
    }

    const persisted = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!persisted) {
      return INITIAL_RESERVATIONS;
    }

    try {
      const parsed = JSON.parse(persisted) as Reservation[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  }

  private saveReservations(reservations: Reservation[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  }

  private generateReservationCode(): string {
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `RSV-${random}`;
  }
}
