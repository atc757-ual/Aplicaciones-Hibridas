import { inject, Injectable } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, 
signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/internal/operators/map';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private auth = inject(Auth); 
  public user$ = user(this.auth); 
  public currentUser = toSignal(this.user$); 
  public isLoggedIn$ = this.user$.pipe(map(user => !!user));

  async login(email: string, password: string) { 
    console.log(signInWithEmailAndPassword(this.auth, email, password));
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() { 
    return signOut(this.auth);
  }

  getUID() { 
    return this.auth.currentUser?.uid;
  }

  async register(email: string, password: string): Promise<string> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    return cred.user.uid;
  }
  

}
