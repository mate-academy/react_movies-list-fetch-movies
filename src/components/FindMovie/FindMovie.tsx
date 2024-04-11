import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  currentMovie: MovieData | ResponseError | null;
  setCurrentMovie: (value: MovieData | ResponseError | null) => void;
  addMovies: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  currentMovie,
  setCurrentMovie,
  addMovies,
}) => {
  const [query, setQuery] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSearchFilm = (value: string) => {
    setLoader(true);
    getMovie(value)
      .then(res => {
        setCurrentMovie(res);
        // prettier-ignore
        // eslint-disable-next-line
        res && 'Error' in res ? setHasError(true) : setHasError(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const movie =
    // prettier-ignore
    currentMovie && 'Title' in currentMovie ? {
        // eslint-disable-next-line
        // prettier-ignore
        title: currentMovie.Title,
        description: currentMovie.Plot,
        imgUrl:
            currentMovie.Poster !== 'N/A'
              ? currentMovie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: 'https://www.imdb.com/title/' + currentMovie.imdbID,
        imdbId: currentMovie.imdbID,
      }
      : null;

  const handleAddMovie = () => {
    if (movie) {
      if (!movies.find(item => item.title === movie.title)) {
        addMovies(movie);
        setQuery('');
        setCurrentMovie(null);
      } else {
        setQuery('');
        setCurrentMovie(null);
      }
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          handleSearchFilm(query);
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setHasError(false);
              }}
            />
          </div>

          {query && hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
              disabled={query ? false : true}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {currentMovie && 'Title' in currentMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
