import { FormField } from './FormField';
import { Select } from '@/shared/components/ui/Select';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
}

export function FormSelect({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  error,
}: FormSelectProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={`Select ${label.toLowerCase()}...`}
        className="w-full"
      />
    </FormField>
  );
}
