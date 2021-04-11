import PropTypes from 'prop-types';
import React from 'react';
import { request } from '../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export class FindMovie extends React.Component {
  state = {
    title: '',
    hasTitleError: false,
    isMovieError: false,
    movie: null,
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      hasTitleError: false,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { title } = this.state;

    request(title)
      .then((movie) => {
        this.setState(movie.Response !== 'False' ? {
          movie: {
            ...movie,
            title: movie.Title,
            description: movie.Plot,
            imdbId: movie.imdbID,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          },
          isMovieError: false,
        } : {
          movie: null,
          isMovieError: true,
        });
      });

    if (!title) {
      this.setState({
        hasTitleError: true,
      });
    }
  }

  addNewMovie = () => {
    const { isMovieError } = this.state;

    if (!isMovieError) {
      this.props.addMovie(this.state.movie);
      this.setState({
        movie: null,
      });
    }

    this.setState({
      title: '',
    });
  }

  render() {
    const { movie, title, isMovieError } = this.state;

    return (
      <>
        <form className="find-movie" onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Movie title
            </label>

            <div className="control">
              <input
                type="text"
                name="title"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={title}
                onChange={this.handleInputChange}
              />
            </div>
            {this.state.hasTitleError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}

            {this.state.isMovieError && (
            <p className="help is-danger">
              Movie doesn&apos;t exist!
            </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className="button is-light"
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={() => this.addNewMovie()}
              >
                Add to the list
              </button>
            </div>
          </div>
        </form>

        <div className="container">
          <h2 className="title">Preview</h2>
          {movie && !isMovieError
          && <MovieCard movie={movie} />
          }
        </div>
      </>
    );
  }
}

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
