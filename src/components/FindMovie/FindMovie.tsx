import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../api';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (movies:Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [film, setFilm] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [displayMovie, setDisplayMovie] = useState(false);

  const loadMovie = async (movieName: string) => {
    const result = await getMovie(movieName);

    if (result.Response === 'False') {
      setSearchError(true);
    } else {
      setSearchError(false);

      setFilm({
        Poster: result.Poster,
        Title: result.Title,
        Plot: result.Plot,
        imdbID: result.imdbID,
      });
      setDisplayMovie(true);
    }
  };

  const addMovie = () => {
    if (displayMovie && !props.movies.find(movie => movie.imdbID === film.imdbID)) {
      props.setMovies([...props.movies, film]);
      setDisplayMovie(false);
    }
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
                'is-danger': searchError,
              })}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setDisplayMovie(false);
              }}
            />
          </div>

          <p className={classNames(
            'help',
            {
              hideError: !searchError,
              showError: searchError,
              'is-danger': searchError,
            },
          )}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => loadMovie(searchText)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {displayMovie && <MovieCard movie={film} />}
      </div>
    </>
  );
};
