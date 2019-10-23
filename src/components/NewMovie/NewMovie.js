import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormField } from '../FormField';

const initialState = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export class NewMovie extends Component {
  state = initialState;

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onAdd(this.state);

    this.setState(initialState);
  };

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  render() {
    const {
      title,
      description,
      imgUrl,
      imdbUrl,
      imdbId,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormField
          value={title}
          name="title"
          placeholder="Input movie title"
          label="Title"
          onChange={this.handleChange}
        />
        <FormField
          value={description}
          name="description"
          placeholder="Input movie description"
          label="Description"
          onChange={this.handleChange}
        />
        <FormField
          value={imgUrl}
          name="imgUrl"
          placeholder="Paste image url"
          label="Image url"
          onChange={this.handleChange}
        />
        <FormField
          value={imdbUrl}
          name="imdbUrl"
          placeholder="Paste IMDB url"
          label="IMDB url"
          onChange={this.handleChange}
        />
        <FormField
          value={imdbId}
          name="imdbId"
          placeholder="Enter IMDB id"
          label="IMDB id"
          onChange={this.handleChange}
        />

        <button
          type="submit"
          className="button is-primary"
        >
          Add movie
        </button>
      </form>
    );
  }
}

NewMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
