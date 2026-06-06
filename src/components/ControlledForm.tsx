import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../shared/store';
import { createFormSchema } from '../shared/validationSchema';
import {
  convertToBase64,
  checkPasswordStrength,
  PasswordStrength,
} from '../shared/utils';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import styles from './ControlledForm.module.css';

interface ControlledFormProps {
  onSuccess: () => void;
}

const schema = createFormSchema(useFormStore.getState().countries);
type FormValues = z.infer<typeof schema>;

export const ControlledForm: React.FC<ControlledFormProps> = ({
  onSuccess,
}) => {
  const { countries, addSubmission } = useFormStore();
  const [passStrength, setPassStrength] = useState<PasswordStrength | null>(
    null
  );
  const [countryQuery, setCountryQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');
  useEffect(() => {
    if (passwordValue) {
      setPassStrength(checkPasswordStrength(passwordValue));
    } else {
      setPassStrength(null);
    }
  }, [passwordValue]);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const onSubmit = async (data: FormValues) => {
    let base64Image = '';

    if (data.image && data.image.length > 0) {
      const file = data.image[0];

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type) || file.size > 2 * 1024 * 1024) {
        alert('File Error: PNG/JPEGs up to 2MB allowed');
        return;
      }
      base64Image = await convertToBase64(file);
    }

    addSubmission({
      name: data.name,
      age: Number(data.age),
      email: data.email,
      gender: data.gender,
      country: data.country,
      image: base64Image,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        id="rhf-name"
        label="Name"
        type="text"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        id="rhf-age"
        label="Age"
        type="number"
        {...register('age', { valueAsNumber: true })}
        error={errors.age?.message}
      />
      <Input
        id="rhf-email"
        label="Email"
        type="text"
        {...register('email')}
        error={errors.email?.message}
      />

      <Select
        id="rhf-gender"
        label="Gender"
        {...register('gender')}
        error={errors.gender?.message}
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
      />

      <div className={styles.autocompleteContainer}>
        <label htmlFor="rhf-country" className={styles.autocompleteLabel}>
          Country
        </label>
        <input
          id="rhf-country"
          type="text"
          value={countryQuery}
          onChange={(e) => {
            setCountryQuery(e.target.value);
            setShowDropdown(true);
            setValue('country', e.target.value, { shouldValidate: true });
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Select from the list..."
          className={`${styles.autocompleteInput} ${errors.country ? styles.inputError : ''}`}
          autoComplete="off"
        />
        {showDropdown && filteredCountries.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredCountries.map((c) => (
              <li
                key={c}
                onClick={() => {
                  setCountryQuery(c);
                  setValue('country', c, { shouldValidate: true });
                  setShowDropdown(false);
                }}
                className={styles.dropdownItem}
              >
                {c}
              </li>
            ))}
          </ul>
        )}
        {errors.country && (
          <p className={styles.errorText}>{errors.country.message}</p>
        )}
      </div>

      <Input
        id="rhf-image"
        label="Avatar (PNG/JPEG)"
        type="file"
        accept=".png,.jpeg,.jpg"
        {...register('image')}
      />

      <div className={styles.row}>
        <Input
          id="rhf-password"
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          id="rhf-confirmPassword"
          label="Confirm password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      {passStrength && (
        <div className={styles.strengthIndicator}>
          <p className={styles.strengthTitle}>
            Password complexity: {passStrength.score} / 4
          </p>
        </div>
      )}

      <div className={styles.checkboxContainer}>
        <input id="rhf-terms" type="checkbox" {...register('terms')} />
        <label htmlFor="rhf-terms" className={styles.checkboxLabel}>
          I agree to the terms of use
        </label>
      </div>
      {errors.terms && (
        <p
          className={styles.errorText}
          style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}
        >
          {errors.terms.message}
        </p>
      )}

      <Button type="submit" disabled={!isValid}>
        Submit (React Hook Form)
      </Button>
    </form>
  );
};
