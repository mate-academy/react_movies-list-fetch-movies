import classnames from 'classnames';
import { InputProps } from '../../types/Input';

export const Input: React.FC<InputProps> = ({
  id,
  type,
  value,
  label,
  dataCy,
  hasError,
  placeholder,
  onChange,
}) => (
  <>
    <label className="label" htmlFor={id}>
      {label}
    </label>

    <div className="control">
      <input
        id={id}
        type={type}
        value={value}
        data-cy={dataCy}
        placeholder={placeholder}
        className={classnames('input', { 'is-dander': hasError })}
        onChange={onChange}
      />
    </div>

    {hasError && (
      <p className="help is-danger" data-cy="errorMessage">
        Can&apos;t find a movie with such a title
      </p>
    )}
  </>
);
