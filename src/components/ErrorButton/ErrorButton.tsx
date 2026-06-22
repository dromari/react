'use client';

import { useState } from 'react';
import styles from '@/app/[locale]/page.module.css';

interface ErrorButtonProps {
  buttonText: string;
}

export default function ErrorButton({ buttonText }: ErrorButtonProps) {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (shouldThrowError) {
    throw new Error('Test Error');
  }

  return (
    <button
      className={styles.errorButton}
      title={buttonText}
      onClick={() => setShouldThrowError(true)}
    >
      {buttonText}
    </button>
  );
}
