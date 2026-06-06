import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    const inputClassName = `${styles.input} ${error ? styles.inputError : ''} ${className}`;

    return (
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input id={inputId} ref={ref} className={inputClassName} {...props} />
        <p className={styles.errorText}>{error || ''}</p>
      </div>
    );
  }
);

Input.displayName = 'Input';
