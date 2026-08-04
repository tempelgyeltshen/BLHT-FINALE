import { ContentModel } from '../models/content.js';
import type { Entity } from './fileRepository.js';

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

export class MongoRepository<T extends Entity> {
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
    const row = await ContentModel.findOneAndUpdate(
      { _id: id, collection: this.collection },
      { $set: { data } },
      { new: true, runValidators: true }
    ).lean() as unknown as Row | null;
    
    return row ? mapRow<T>(row) : null;
  }
  
  async delete(id: string) {
    return Boolean(await ContentModel.findOneAndDelete({ _id: id, collection: this.collection }));
  }
}
