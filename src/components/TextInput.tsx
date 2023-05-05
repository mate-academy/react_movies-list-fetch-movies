import { ChangeEvent, FC } from 'react';
import cn from 'classnames';
import { textInputDefaults } from '../utils/textInputDefaults';

interface Props {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: FC<Props> = ({
  label,
  id,
  value,
  placeholder = textInputDefaults.placeholder,
  className = textInputDefaults.className,
  error = textInputDefaults.error,
  errorMessage = textInputDefaults.errorMessage,
  onChange,
}) => (
  <div className="field">
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <div className="control">
      <input
        data-cy="titleField"
        type="text"
        value={value}
        id={id}
        placeholder={placeholder}
        className={cn('input', className, { 'is-danger': error })}
        onChange={onChange}
      />
    </div>
    {error && (
      <p className="help is-danger" data-cy="errorMessage">
        {errorMessage}
      </p>
    )}
  </div>
);

TextInput.defaultProps = textInputDefaults;
