import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Key } from '../model/key';
import { v4 as uuidv4 } from 'uuid';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private storageKey = 'keys';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }


  // Store Key
  async storeKey(Key: Key) {
    await this._storage?.set(Key.id!, Key);
  }

  // Remove specific Key
  async removeKey(id: string) {
    await this._storage?.remove(id);
  }

  // Update specific Key
  async updateKey(Key: Key) {
    await this._storage?.set(Key.id!, Key);
  }

  // Get all Keys
  async getAllKeys(): Promise<Key[]> {
    const keys = await this._storage?.keys() || [];
    const Keys: Key[] = [];
    for (const key of keys) {
      const Key = await this._storage?.get(key);
      if (Key) {
        Keys.push(Key);
      }
    }
    return Keys;
  }

  // Search Key with filters
  async searchKeys(make?: string, model?: string, trim?: string, year?: number): Promise<Key[]> {
    const allKeys = await this.getAllKeys();
    return allKeys.filter(Key => {
      return Key.vehicles?.some(info => {
        const matchMake = !make || info.make === make;
        const matchModel = !model || info.model === model;
        const matchTrim = !trim || info.trim === trim;
        const matchYear = !year || (year >= info.yearFrom && year <= info.yearTo);
        return matchMake && matchModel && matchTrim && matchYear;
      });
    });
  }

  // Get all unique makes
  async getUniqueMakes(): Promise<string[]> {
    const allKeys = await this.getAllKeys();
    const makes = new Set<string>();
    allKeys?.forEach(Key => {
      Key.vehicles?.forEach(info => {
        makes.add(info.make);
      });
    });
    return Array.from(makes);
  }

  // Get all unique models
  async getUniqueModels(): Promise<string[]> {
    const allKeys = await this.getAllKeys();
    const models = new Set<string>();
    allKeys?.forEach(Key => {
      Key.vehicles?.forEach(info => {
        models.add(info.model);
      });
    });
    return Array.from(models);
  }

  // Get all unique trims
  async getUniqueTrims(): Promise<string[]> {
    const allKeys = await this.getAllKeys();
    const trims = new Set<string>();
    allKeys?.forEach(Key => {
      Key.vehicles?.forEach(info => {
        trims.add(info.trim);
      });
    });
    return Array.from(trims);
  }

  async getUniqueTypes(): Promise<(string)[]> {
    const keys: Key[] = await this.getAllKeys();
    const types = keys.map(key => key.type || "");
    return Array.from(new Set(types)); // Return unique types
  }

  // Get unique list of makers
  async getUniqueMakers(): Promise<(string)[]> {
    const keys: Key[] = await this.getAllKeys() || [];
    const makers = keys.map(key => key.maker || "");
    return Array.from(new Set(makers)); // Return unique makers
  }

  clearDatabase() {
    this._storage?.clear();
  }

  async uploadDataFromJson(data: Key[]): Promise<void> {
    data.forEach(async (item) => {
      item.id = uuidv4();
      await this.storeKey(item);
    });
  }

  async checkPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const status = await Filesystem.checkPermissions();
      if (status.publicStorage !== 'granted') {
        const result = await Filesystem.requestPermissions();
        return result.publicStorage === 'granted';
      }
      return true;
    }
    return false; // Assume permissions are granted in web
  }

  async sendData(url: string): Promise<any> {
    // const keys = await this.getAllKeys();
    // // const json = JSON.stringify(keys);
    // return axios.post(url, { keys }, { headers: { "Content-Type": "application/json" } }).then((response) => {
    //   return response;
    // }).catch((error) => {
    //   return { error: "error", data: error };
    // });
  }

  async downloadDatabaseAsJson(): Promise<void> {
    try {
      const hasWritePermission = await this.checkPermissions();

      if (!hasWritePermission) {
        console.error('Permission not granted to write to external storage');
        return;
      }

      const keys = await this.getAllKeys();
      const json = JSON.stringify(keys);

      await Filesystem.writeFile({
        path: `keys_${new Date().toISOString()}.json`,
        data: json,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      console.log('File written successfully');
    } catch (error) {
      console.error('Unable to write file', error);
    }
  }

}


