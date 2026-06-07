import React, { useState, useRef } from 'react';
import { useFormStore } from '../../shared/store';
import {
  convertToBase64,
  checkPasswordStrength,
  PasswordStrength,
} from '../../shared/utils';
import { createFormSchema } from '../../shared/validationSchema';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import styles from './Form.module.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({
  onSuccess,
}) => {
  const { countries, addSubmission } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passStrength, setPassStrength] = useState<PasswordStrength | null>(
    null
  );

  const [countryQuery, setCountryQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassStrength(checkPasswordStrength(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentForm = e.currentTarget;
    setErrors({});

    const formData = new FormData(currentForm);
    const rawData = {
      name: formData.get('name') as string,
      age: formData.get('age') ? Number(formData.get('age')) : NaN,
      email: formData.get('email') as string,
      gender: formData.get('gender') as string,
      country: formData.get('country') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      terms: formData.get('terms') === 'on',
    };

    const schema = createFormSchema(countries);
    const result = schema.safeParse(rawData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = Array.isArray(issue.path)
          ? String(issue.path[0])
          : String(issue.path);
        if (!newErrors[path]) newErrors[path] = issue.message;
      });
    }

    const imageFile = formData.get('image') as File;
    let base64Image = '';

    if (imageFile && imageFile.size > 0) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(imageFile.type)) {
        newErrors['image'] = 'Only PNG and JPEG formats are allowed.';
      } else if (imageFile.size > 2 * 1024 * 1024) {
        newErrors['image'] = 'The file size must not exceed 2 MB';
      } else {
        base64Image = await convertToBase64(imageFile);
      }
    } else {
      newErrors['image'] = 'Please upload an avatar';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (result.success) {
      addSubmission({
        name: rawData.name,
        age: rawData.age,
        email: rawData.email,
        gender: rawData.gender,
        country: rawData.country,
        image: base64Image,
      });
      if (currentForm) {
        currentForm.reset();
      }

      setCountryQuery('');
      setPassStrength(null);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        id="unc-name"
        label="Name"
        name="name"
        type="text"
        error={errors.name}
      />
      <Input
        id="unc-age"
        label="Age"
        name="age"
        type="number"
        error={errors.age}
      />
      <Input
        id="unc-email"
        label="Email"
        name="email"
        type="text"
        error={errors.email}
      />

      <Select
        id="unc-gender"
        label="Gender"
        name="gender"
        error={errors.gender}
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
      />

      <div ref={autocompleteRef} className={styles.autocompleteContainer}>
        <label htmlFor="unc-country" className={styles.autocompleteLabel}>
          Country
        </label>
        <input
          id="unc-country"
          name="country"
          type="text"
          onChange={(e) => {
            setCountryQuery(e.target.value);
            setShowDropdown(true);
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
                  setShowDropdown(false);
                }}
                className={styles.dropdownItem}
              >
                {c}
              </li>
            ))}
          </ul>
        )}
        <p className={styles.errorText}>{errors.country || ''}</p>
      </div>

      <Input
        id="unc-image"
        label="Avatar (PNG/JPEG)"
        name="image"
        type="file"
        accept=".png,.jpeg,.jpg"
        error={errors.image}
      />

      <div className={styles.row}>
        <Input
          id="unc-password"
          label="Password"
          name="password"
          type="password"
          onChange={handlePasswordChange}
          error={errors.password}
        />
        <Input
          id="unc-confirmPassword"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword}
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
        <input id="unc-terms" name="terms" type="checkbox" />
        <label htmlFor="unc-terms" className={styles.checkboxLabel}>
          I agree to the terms of use
        </label>
      </div>
      {errors.terms && (
        <p
          className={styles.errorText}
          style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}
        >
          {errors.terms}
        </p>
      )}

      <Button type="submit">Submit (Uncontrolled)</Button>
    </form>
  );
};
