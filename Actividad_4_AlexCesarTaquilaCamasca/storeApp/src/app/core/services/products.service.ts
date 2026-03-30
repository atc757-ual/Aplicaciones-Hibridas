import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, 
doc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { getStorage,ref,uploadBytes,getDownloadURL } from 'firebase/storage';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';
import { switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private productsCollection = collection(this.firestore, 'products');
  
  private storage = getStorage();
  //Guardar archivo en Firebase Storage
  private async subirImagen(file: File): Promise<string> {
    try {
      const filePath = `productos/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);

      // Subir archivo
      await uploadBytes(storageRef, file);

      // Obtener URL pública
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  }

  // Observable que emite los productos del usuario autenticado
  private products$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (user) {
        const q = query(
          this.productsCollection,
          where('userId', '==', user.uid),
        );
        return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
      } else {
        return collectionData(this.productsCollection, {
          idField: 'id',
        }) as Observable<Product[]>;
      }
    }),
  );

  public products = toSignal(this.products$, { initialValue: [] });

  async addProduct(product: Product) {
    console.log(product);
    const uid = this.authService.getUID();
    if (product.imagefile) {
      try {
        // Usar el File puro
        const imageUrl = await this.subirImagen(product.imagefile);
        product.imageUrl = imageUrl;
      } catch (error) {
        console.error('Error al subir imagen:', error);
        throw new Error('Error al subir imagen');
      }
    }
    console.log(product)
    product.createAt = new Date();
    if (product.imagefile != null) {
      delete product.imagefile;
    }
    if (!uid) throw new Error('No hay usuario autenticado');
    return addDoc(this.productsCollection, {
      ...product,
      userId: uid,
    });
  }

  async deleteProduct(productId: string) {
    const uid = this.authService.getUID();
    if (!uid) throw new Error('No hay usuario autenticado');

    // 1. Obtener referencia al documento
    const productRef = doc(this.firestore, 'products', productId);

    // 2. Obtener el producto para verificar el userId
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Producto no encontrado');
    }
    // 3. Verificar que el userId coincida con el usuario actual
    const productData = productSnap.data();
    if (productData['userId'] !== uid) {
      throw new Error('No tienes permiso para eliminar este producto');
    }
    // 4. Si todo está bien, eliminar
    return deleteDoc(productRef);
  }

  async obtenerProducto(productId: string) {
    const uid = this.authService.getUID();
    if (!uid) throw new Error('No hay usuario autenticado');

    // 1. Obtener referencia al documento
    const productRef = doc(this.firestore, 'products', productId);

    // 2. Obtener el producto para verificar el userId
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Producto no encontrado');
    }
    // 3. Verificar que el userId coincida con el usuario actual
    const productData = productSnap.data();
    if (productData['userId'] !== uid) {
      throw new Error('No tienes permiso para acceder a este producto');
    }
    // 4. Si todo está bien, devolver el producto
    return productSnap.data();
  }
}
