import { useEffect, useMemo } from 'react';
import { COUNTRIES, findCountry } from '@/lib/countries';
import SearchableSelect from './SearchableSelect';

export interface PhoneInputProps {
  /**
   * Combined phone value, formatted as `+<dial> <number>` (e.g. "+63 9171234567").
   * Storing a single string keeps backward compatibility with the existing payload.
   */
  value: string;
  onChange: (value: string) => void;
  /** Optional country name, used to keep dropdown in sync with parent state. */
  countryName?: string;
  onCountryChange?: (countryName: string) => void;
  className?: string;
}

function splitPhone(value: string): { dial: string; number: string } {
  const trimmed = (value || '').trim();
  const m = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
  if (m) return { dial: m[1], number: m[2] };
  return { dial: '', number: trimmed };
}

const PhoneInput = ({ value, onChange, countryName, onCountryChange, className = '' }: PhoneInputProps) => {
  const { dial, number } = useMemo(() => splitPhone(value), [value]);

  const countryNames = useMemo(() => COUNTRIES.map((c) => c.name), []);

  // Rehydrate country dropdown from the persisted dial code (e.g. after reload).
  // Many dial codes are shared (+1 → US/CA/etc.), so we pick the first match
  // only when no country is set yet — never overwrite a user selection.
  useEffect(() => {
    if (countryName || !dial || !onCountryChange) return;
    const match = COUNTRIES.find((c) => c.dial === dial);
    if (match) onCountryChange(match.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dial, countryName]);

  const handleCountry = (name: string) => {
    onCountryChange?.(name);
    const c = findCountry(name);
    if (c) {
      onChange(`${c.dial} ${number}`.trim());
    }
  };

  const handleDial = (next: string) => {
    const cleaned = next.replace(/[^\d+]/g, '');
    const withPlus = cleaned.startsWith('+') ? cleaned : cleaned ? `+${cleaned}` : '';
    onChange(`${withPlus} ${number}`.trim());
  };

  const handleNumber = (next: string) => {
    const cleaned = next.replace(/[^\d ()-]/g, '');
    onChange(`${dial} ${cleaned}`.trim());
  };

  return (
    <div className={`grid grid-cols-[1.4fr_0.7fr_2fr] gap-2 ${className}`}>
      <SearchableSelect
        value={countryName || ''}
        onChange={handleCountry}
        options={countryNames}
        placeholder="Country"
        allowClear={false}
      />
      <input
        type="text"
        inputMode="tel"
        value={dial}
        onChange={(e) => handleDial(e.target.value)}
        placeholder="+1"
        className="form-input"
        aria-label="Dialing code"
      />
      <input
        type="tel"
        value={number}
        onChange={(e) => handleNumber(e.target.value)}
        placeholder="Phone number"
        className="form-input"
        aria-label="Phone number"
      />
    </div>
  );
};

export default PhoneInput;
