import { forwardRef, SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, ...props }, ref) => {
    const selectId = id || props.name;
    const selectClassName = `${styles.select} ${error ? styles.selectError : ''}`;

    return (
      <div className={styles.field}>
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
        <select id={selectId} ref={ref} className={selectClassName} {...props}>
          <option value="">Выберите...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className={styles.errorText}>{error || ''}</p>
      </div>
    );
  }
);

Select.displayName = 'Select';
