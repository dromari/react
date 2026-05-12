import '@testing-library/jest-dom';
import { server } from './__tests__/node';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
