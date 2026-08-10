import { ContentModel } from '../models/Content.js';
import type { Entity } from '../types/entity.js';
import type { BaseRepository } from './BaseRepository.js';

type Row = {
  _id: { toString(): string };
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const mapRow = <T extends Entity>(row: Row): T => ({
  ...row.data,
  id: row._id.toString(),
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
} as T);

export class MongoRepository<T extends Entity> implements BaseRepository<T> {
  constructor(private readonly collection: string) {}
  
  async list() {
    return ((await ContentModel.find({ collection: this.collection }).lean()) as unknown as Row[])
      .map(mapRow<T>);
  }
  
  async get(id: string) {
    const row = await ContentModel.findOne({ _id: id, collection: this.collection }).lean() as unknown as Row | null;
    return row ? mapRow<T>(row) : null;
  }
  
  async create(data: Omit<T, keyof Entity>) {
    return mapRow<T>(await ContentModel.create({ collection: this.collection, data }) as unknown as Row);
  }
  
  async update(id: string, data: Partial<Omit<T, keyof Entity>>) {
    // Merge only the provided fields into the existing document instead of
    // replacing the whole `data` object. A full replacement would silently
    // drop unset fields (e.g. slug, pdfUrl) on partial PATCHes and can trip
    // unique indexes (e.g. two documents with slug: null).
    const set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      set[`data.${key}`] = value;
    }
    const row = await ContentModel.findOneAndUpdate(
      { _id: id, collection: this.collection },
      { $set: set },
      { new: true, runValidators: true }
    ).lean() as unknown as Row | null;
    
    return row ? mapRow<T>(row) : null;
  }
  
  async delete(id: string) {
    return Boolean(await ContentModel.findOneAndDelete({ _id: id, collection: this.collection }));
  }
}
