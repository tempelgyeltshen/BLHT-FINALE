import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface Entity { id: string; createdAt: string; updatedAt: string; }

export class FileRepository<T extends Entity> {
  private readonly directory = path.resolve(process.cwd(), 'data');
  private readonly file: string;
  constructor(collection: string) { 
    this.file = path.join(this.directory, `${collection}.json`); 
  }
  private async read(): Promise<T[]> { try { return JSON.parse(await readFile(this.file, 'utf8')) as T[]; } catch (error: unknown) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; } }
  private async write(values: T[]) { await mkdir(this.directory, { recursive: true }); const temporary = `${this.file}.${randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify(values, null, 2), 'utf8'); await rename(temporary, this.file); }
  async list() { return this.read(); }
  async get(id: string) { return (await this.read()).find((item) => item.id === id) ?? null; }
  async create(data: Omit<T, keyof Entity>) { const now = new Date().toISOString(); const item = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T; const values = await this.read(); values.unshift(item); await this.write(values); return item; }
  async update(id: string, data: Partial<Omit<T, keyof Entity>>) { const values = await this.read(); const index = values.findIndex((item) => item.id === id); if (index < 0) return null; const item = { ...values[index], ...data, id, createdAt: values[index].createdAt, updatedAt: new Date().toISOString() }; values[index] = item; await this.write(values); return item; }
  async delete(id: string) { const values = await this.read(); const next = values.filter((item) => item.id !== id); if (next.length === values.length) return false; await this.write(next); return true; }
}
