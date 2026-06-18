import express from 'express';
import { buildContainer } from '../../di/container';
import { getTestPrisma } from './testDb';
 
  export function createTestApp(overrides = {}) {
    const db = getTestPrisma();
    const container = buildContainer();
    const app = express();
    app.use(express.json());
    // mount routers from container
    return app;
 }