import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock logger before importing
vi.mock('../logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}));

// Mutable env mock
const mockEnv = {
  mongodbUri: 'mongodb://localhost:27017/test',
  nodeEnv: 'test',
};
vi.mock('../env.js', () => ({ env: mockEnv }));

// Mock mongoose
const mockConnect = vi.fn();
const mockClose = vi.fn();
const mockOn = vi.fn();
const connectionHandlers: Record<string, Function> = {};
mockOn.mockImplementation((event: string, handler: Function) => {
  connectionHandlers[event] = handler;
});

vi.mock('mongoose', () => ({
  default: {
    connect: mockConnect,
    connection: {
      on: mockOn,
      close: mockClose,
    },
  }
}));

const { connectDatabase } = await import('../database.js');

describe('connectDatabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.mongodbUri = 'mongodb://localhost:27017/test';
    mockEnv.nodeEnv = 'test';
    mockConnect.mockResolvedValue(undefined);
    for (const key of Object.keys(connectionHandlers)) delete connectionHandlers[key];
  });

  it('should skip connection when MONGODB_URI is not set', async () => {
    mockEnv.mongodbUri = '';
    await connectDatabase();
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should connect and register event handlers on success', async () => {
    await connectDatabase();
    expect(mockConnect).toHaveBeenCalledWith('mongodb://localhost:27017/test', expect.objectContaining({
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 50,
    }));
    // Event handlers registered
    expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('disconnected', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('reconnected', expect.any(Function));
  });

  it('should continue without DB in non-production when connect fails', async () => {
    mockConnect.mockRejectedValue(new Error('connection refused'));
    await expect(connectDatabase()).resolves.toBeUndefined();
  });

  it('should exit(1) in production when connect fails', async () => {
    mockEnv.nodeEnv = 'production';
    mockConnect.mockRejectedValue(new Error('connection refused'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any);
    await connectDatabase();
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it('should fire connection error handler', async () => {
    await connectDatabase();
    const errorHandler = connectionHandlers['error'];
    expect(errorHandler).toBeDefined();
    // Should not throw when invoked
    expect(() => errorHandler({ message: 'conn lost' })).not.toThrow();
  });

  it('should fire disconnected handler', async () => {
    await connectDatabase();
    const disconnected = connectionHandlers['disconnected'];
    expect(disconnected).toBeDefined();
    expect(() => disconnected()).not.toThrow();
  });
});
