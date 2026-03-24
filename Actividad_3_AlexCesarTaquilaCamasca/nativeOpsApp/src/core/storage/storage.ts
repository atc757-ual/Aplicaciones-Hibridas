// storage.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'  
})
export class StorageService {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await Preferences.set({
        key: key,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItems<T>(key: string): Promise<T | null> {
    try {
      const ret = await Preferences.get({ key });
      if (ret.value) {
        return JSON.parse(ret.value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async existsItem(key: string): Promise<boolean> {
    try {
      const result = await Preferences.get({ key });
      return result.value !== null;
    } catch (error) {
      console.error(`Error checking ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }


  
}