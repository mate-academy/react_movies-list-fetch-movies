import React from 'react';
import PropTypes from 'prop-types';
import './FormField.scss';

export const FormField = (props) => {
  const {
    name,
    label,
    onChange,
    placeholder,
    value,
    type,
  } = props;

  return (
    <div className="field">
      <label htmlFor={name} className="label">
        {label}
      </label>

      <div className="control">
        <input
          name={name}
          id={name}
          className="input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

FormField.defaultProps = {
  type: 'text',
  placeholder: 'Type text here',
};
