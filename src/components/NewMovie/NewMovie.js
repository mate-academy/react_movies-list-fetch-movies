import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormField } from '../FormField';
import { CONTROLS_NAMES, FORM_CONFIG } from '../../constants/newMovieForm';

const controlsInitialState = CONTROLS_NAMES.reduce((acc, name) => {
  const { values, errors, touched } = acc;

  return {
    values: {
      ...values,
      [name]: '',
    },
    errors: {
      ...errors,
      [name]: null,
    },
    touched: {
      ...touched,
      [name]: false,
    },
  };
}, {
  values: {},
  errors: {},
  touched: {},
});

export class NewMovie extends Component {
  state = {
    ...controlsInitialState,
    isValid: true,
  };

  componentDidMount() {
    const { errors, isValid } = this.validate();

    this.setState({ errors, isValid });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { isValid, values } = this.state;

    if (!isValid) {
      return;
    }

    this.props.onAdd(values);

    this.setState(controlsInitialState);
  };

  handleChange = ({ target }) => {
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [target.name]: target.value,
      },
    }));
  };

  handleBlur = ({ target: { name, value } }) => {
    this.setState((prevState) => {
      const validator = FORM_CONFIG[name].validate;
      const error = validator
        ? validator(name, value)
        : null;
      const newErrors = {
        ...prevState.errors,
        [name]: error,
      };
      const isValid = Object.values(newErrors)
        .every(err => !err);

      return {
        touched: {
          ...prevState.touched,
          [name]: true,
        },
        errors: newErrors,
        isValid,
      };
    });
  };

  validate = () => {
    const { values } = this.state;
    const errorsEntries = CONTROLS_NAMES.map((name) => {
      const validator = FORM_CONFIG[name].validate;
      const error = validator
        ? validator(name, values[name])
        : null;

      return [name, error];
    });
    const isValid = errorsEntries.every(([name, error]) => !error);

    return {
      errors: Object.fromEntries(errorsEntries),
      isValid,
    };
  };

  render() {
    const {
      values,
      errors,
      touched,
      isValid,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        {CONTROLS_NAMES.map((name) => {
          const { label, placeholder } = FORM_CONFIG[name];

          return (
            <FormField
              key={name}
              value={values[name]}
              name={name}
              placeholder={placeholder}
              label={label}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              touched={touched[name]}
              error={errors[name]}
            />
          );
        })}

        <button
          type="submit"
          className="button is-primary"
          disabled={!isValid}
        >
          Add Movie
        </button>
      </form>
    );
  }
}

NewMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
