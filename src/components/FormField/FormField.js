import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './FormField.scss';

export const FormField = (props) => {
  const {
    name,
    label,
    onChange,
    onBlur,
    placeholder,
    value,
    type,
    touched,
    error,
  } = props;

  const inputClass = cx('input', { 'is-danger': touched && !!error });

  return (
    <div className="field">
      <label htmlFor={name} className="label">
        {label}
      </label>

      <div className="control">
        <input
          name={name}
          id={name}
          className={inputClass}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>

      {touched && error && (
        <p className="help is-danger">{error}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  touched: PropTypes.bool.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};

FormField.defaultProps = {
  type: 'text',
  placeholder: 'Type text here',
  error: '',
};
