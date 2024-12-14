import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

interface Props {
  onMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const DEFAULT_PICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const findMovie = () => {
    setError(false);
    setIsLoading(true);
    getMovie(query)
      .then(response => {
        if ('Title' in response) {
          const { Title, Plot, Poster, imdbID }: MovieData = response;

          const correctUrl = Poster === 'N/A' ? DEFAULT_PICTURE : Poster;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: correctUrl,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setError(true);

          return;
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addMovie = () => {
    if (movie) {
      onMovies((prev: Movie[]) => {
        if (prev.findIndex(elem => elem.imdbId === movie.imdbId) !== -1) {
          return prev;
        }

        return [...prev, movie];
      });
    }

    setQuery('');
    setMovie(null);
    setError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => e.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              onChange={handleChangeQuery}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
            />
          </div>

          {error && (
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
              disabled={!query}
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              // className="button is-light"
              onClick={findMovie}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
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
