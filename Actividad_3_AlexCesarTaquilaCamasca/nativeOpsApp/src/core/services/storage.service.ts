import { Preferences } from '@capacitor/preferences'; 

export interface StorageData {
  [key: string]: any;
}

export class StorageService {
  /**  Guarda un objeto en el almacenamiento
   * @param key - Clave para identificar el dato
   * @param value - Objeto a almacenar
  */
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

   /** Obtiene un objeto del almacenamiento
   * @param key 
   * @returns
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const ret = await Preferences.get({ key: key });
      if (ret.value) {
        return JSON.parse(ret.value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  /** Elimina un dato del almacenamiento
   * @param key - Clave del dato a eliminar
   */
  async removeItem(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /** Verifica si existe un dato
   * @param key - Clave a verificar
   * @returns true si existe, false si no
   */
  async ExistsItem(key: string): Promise<boolean> {
    try {
      const { keys } = await Preferences.keys();
      return keys.includes(key);
    } catch (error) {
      console.error(`Error checking ${key}:`, error);
      return false;
    }
  }

  /** Limpia todo el almacenamiento */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();