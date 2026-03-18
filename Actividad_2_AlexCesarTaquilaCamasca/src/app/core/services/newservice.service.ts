import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewService {
  testOperation () { 
    console.log("Executing test operation...");
  }
}
