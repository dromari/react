import { forwardRef, InputHTMLAttributes, useRef, useState } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, type, ...props }, ref) => {
    const inputId = id || props.name;
    const inputClassName = `${styles.input} ${error ? styles.inputError : ''} ${className}`;

    const [fileName, setFileName] = useState<string>('No file chosen');
    const localInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('No file chosen');
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    if (type === 'file') {
      return (
        <div className={styles.field}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>

          <div className={styles.fileWrapper}>
            <input
              id={inputId}
              type="file"
              ref={(node) => {
                localInputRef.current = node;

                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              className={styles.hiddenFileInput}
              {...props}
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={styles.fileButton}
              onClick={() => localInputRef.current?.click()}
            >
              Choose File
            </button>
            <span className={styles.fileName}>{fileName}</span>
          </div>

          <p className={styles.errorText}>{error || ''}</p>
        </div>
      );
    }

    return (
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={inputClassName}
          {...props}
        />
        <p className={styles.errorText}>{error || ''}</p>
      </div>
    );
  }
);

Input.displayName = 'Input';
