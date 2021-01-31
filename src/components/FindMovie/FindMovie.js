import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovieFromServer } from '../../api/api';

export class FindMovie extends React.Component {
  state = {
    title: '',
    findMovie: {},
    error: '',
    errorState: false,
  }

  handleChange = (event) => {
    this.setState({
      title: event.target.value,
      error: '',
      errorState: false,
    });
  };

  handleChangeMovie = () => {
    getMovieFromServer(this.state.title)
      .then((result) => {
        result.Response === 'True'
          ? (
            this.setState({
              findMovie:
              {
                title: result.Title,
                description: result.Plot,
                imgUrl: result.Poster,
                imdbUrl: `http://www.omdbapi.com/?apikey=70273a11&t
                  =${this.title}`,
                imdbId: result.imdbID,
              },
              errorState: false,
            })
          )

          : (
            this.setState({
              errorState: true,
              error: 'Can\'t find a movie with such a title',
            })
          );
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const movieCheck = this.props.movies
      .some(movie => movie.imdbId
        .localeCompare(this.state.findMovie.imdbId) === 0);

    !movieCheck && this.props.onAdd(this.state.findMovie);

    movieCheck && this.setState({
      errorState: true,
      error: 'This movie is already in the list',
    });
    this.resetForm();
  };

  resetForm = () => {
    this.setState({
      title: '',
      findMovie: {},
    });
  }

  render() {
    const {
      title,
      findMovie,
      error,
      errorState,
    } = this.state;

    return (
      <>
        <form
          className="find-movie"
          onSubmit={this.handleSubmit}
        >
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Movie title
            </label>

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error })}
                name="title"
                value={title}
                onChange={this.handleChange}
                // autoComplete="off"
              />
            </div>

            {errorState && (
              <p className="help is-danger">
                {error}
              </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={this.handleChangeMovie}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                type="submit"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          </div>
        </form>

        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...findMovie} />
        </div>
      </>
    );
  }
}

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
