import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, doc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { switchMap, of, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private usersCollection = collection(this.firestore, 'users');

// Observable que emite información del usuario autenticado
  private user$ = this.authService.user$.pipe(
    switchMap((user) => { 
      if (user) {
        const q = query(
          this.usersCollection,
          where('userId', '==', user.uid),
        );
        return collectionData(q, { idField: 'id' }).pipe(
        map((users) => (users as User[])[0] || null)
      ) as Observable<User | null>;
      } else {
        return of(null);
      }
    })
  );

  public user = toSignal(this.user$, { initialValue: null });

  async addUser(user: User) {
    try {
      const uid = await this.authService.register(user.email, user.password);
      if (!uid) return;
      const userData = {
        nombre: user.nombre,
        apellido: user.apellidos,
        email: user.email,
        userId: uid
      };
      return addDoc(this.usersCollection, userData);
    } catch (error) {
      console.error('Error al registrar usuario en Auth:', error);
      throw error;
    }
  }
}
