import { create } from 'zustand';

export interface FormSubmission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  image: string;
  submittedAt: number;
}

interface FormState {
  submissions: FormSubmission[];
  countries: string[];
  addSubmission: (
    submission: Omit<FormSubmission, 'id' | 'submittedAt'>
  ) => void;
}

export const useFormStore = create<FormState>((set) => ({
  submissions: [],
  countries: [
    'Canada',
    'USA',
    'Germany',
    'France',
    'Spain',
    'Japan',
    'Australia',
    'United Kingdom',
  ],
  addSubmission: (data) =>
    set((state) => ({
      submissions: [
        ...state.submissions,
        {
          ...data,
          id: crypto.randomUUID(),
          submittedAt: Date.now(),
        },
      ],
    })),
}));
