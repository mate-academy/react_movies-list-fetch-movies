import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/newMovie';

export const imdbUrl = 'https://www.imdb.com/title/';

export const FindMovie = ({
  addMovie,
  duplicatedMovie,
  setDuplicatedMovie,
}) => {
  const [movie, setMovie] = useState({});
  const [query, setQuery] = useState('');
  const [movieFound, setMovieFound] = useState(true);

  const loadMovie = async() => {
    setMovie({});

    const loadedMovie = await getMovie(query);

    if (loadedMovie.Response === 'False') {
      setMovieFound(false);

      return;
    }

    const newMovie = {
      title: loadedMovie.Title,
      description: loadedMovie.Plot,
      imgUrl: loadedMovie.Poster,
      imdbUrl: `${imdbUrl}${loadedMovie.imdbID}`,
      imdbId: loadedMovie.imdbID,
    };

    setMovieFound(true);
    setMovie(newMovie);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={classnames('input',
                { 'is-danger': movieFound === false })}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDuplicatedMovie(false);
              }}
            />
          </div>

          {!movieFound
            && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}

          {duplicatedMovie
            && (
            <p className="help is-danger">
              Movie already added to the list of movies
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
              disabled={!query || !movie.imdbId}
              onClick={() => {
                addMovie(movie);
                setQuery('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie.imdbId
        && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={movie.title}
            description={movie.description}
            imgUrl={movie.imgUrl}
            imdbUrl={`${imdbUrl}${movie.imdbId}`}
          />
        </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  duplicatedMovie: PropTypes.bool.isRequired,
  setDuplicatedMovie: PropTypes.func.isRequired,
};
