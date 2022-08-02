import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movieToAdd: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [hasError, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const getMovieFromServer = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setLoaded(true);

    const findMovie = await getMovie(query);

    if (!('Title' in findMovie)) {
      setError(true);
      setLoaded(false);

      return;
    }

    const newMovie = {
      title: findMovie.Title,
      description: findMovie.Plot,
      imgUrl: findMovie.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : findMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${findMovie.imdbID}`,
      imdbId: findMovie.imdbID,
    };

    setMovie(newMovie);
    setLoaded(false);
  };

  const addMovieToList = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
      setError(false);
    }

    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={
                (event) => {
                  setQuery(event.target.value);
                  setError(false);
                }
              }
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {`Can't find a movie with title - "${query}"`}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': loaded,
                },
              )}
              onClick={getMovieFromServer}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
