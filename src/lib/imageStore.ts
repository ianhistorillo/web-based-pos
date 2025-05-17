import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ImageDBSchema extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      data: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'pos_images';
const STORE_NAME = 'images';

class ImageStore {
  private db: Promise<IDBPDatabase<ImageDBSchema>>;

  constructor() {
    this.db = openDB<ImageDBSchema>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  async saveImage(imageData: string): Promise<string> {
    const id = crypto.randomUUID();
    const db = await this.db;
    
    await db.put(STORE_NAME, {
      id,
      data: imageData,
      timestamp: Date.now(),
    });
    
    return id;
  }

  async getImage(id: string): Promise<string | null> {
    const db = await this.db;
    const image = await db.get(STORE_NAME, id);
    return image?.data || null;
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.db;
    await db.delete(STORE_NAME, id);
  }
}

export const imageStore = new ImageStore();