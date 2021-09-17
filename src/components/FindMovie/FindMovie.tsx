import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie, movies } = props;
  const [query, setQuery] = useState('');
  const [attempted, setAttempt] = useState(false);
  const [newMovie, setNewMovie] = useState({} as Movie);

  const findNewMovie = async () => {
    const searchedMovie = getMovie(query);

    setNewMovie(await searchedMovie
      .then(movie => ({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
        imdbId: movie.imdbID,
      })));

    setAttempt(true);
  };

  const checkMovieInList = () => {
    if (!newMovie.imdbId) {
      return true;
    }

    const movieMatch = movies
      .findIndex(movie => movie.imdbId === newMovie.imdbId);

    if (movieMatch < 0) {
      return false;
    }

    return true;
  };

  const addMovieToList = () => {
    addMovie([newMovie, ...movies]);
    setQuery('');
    setAttempt(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !newMovie.imdbId && attempted,
              })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setAttempt(false);
              }}
            />
          </div>

          {!newMovie.imdbId && attempted && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findNewMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={checkMovieInList()}
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie.imdbId && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};
