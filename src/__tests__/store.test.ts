import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../shared/store';

describe('Zustand State Management', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('must contain a pre-defined list of countries', () => {
    const state = useFormStore.getState();
    expect(state.countries.length).toBeGreaterThan(0);
    expect(state.countries).toContain('Canada');
  });

  it('addSubmission should successfully add a new submission to the store.', () => {
    const { addSubmission } = useFormStore.getState();

    addSubmission({
      name: 'Alex',
      age: 30,
      email: 'alex@test.com',
      gender: 'male',
      country: 'Germany',
      image: 'base64_string_here',
    });

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('Alex');
    expect(state.submissions[0].id).toBeDefined();
    expect(state.submissions[0].submittedAt).toBeDefined();
  });
});
