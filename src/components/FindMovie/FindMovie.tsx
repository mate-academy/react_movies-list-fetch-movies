import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<boolean>(false);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError('');
  };

  const onAdd = () => {
    if (
      movies.find(movie => movie.imdbId === selectMovie?.imdbId) ||
      selectMovie === null
    ) {
      setQuery('');
      setSelectMovie(null);
      setError('');

      return;
    }

    setQuery('');
    setSelectMovie(null);
    setError('');
    addMovie(selectMovie);
  };

  const hadleSumbmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setSearch(true);
    setError('');

    getMovie(query)
      .then(movie => {
        if ('Response' in movie && movie.Response === 'False') {
          setError(movie.Error);

          return;
        }

        if ('Title' in movie) {
          let corectPoster: string = movie.Poster;

          if (corectPoster === 'N/A') {
            corectPoster =
              'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          const parseMovie: Movie = {
            title: movie.Title,
            description: movie.Plot,
            imgUrl: corectPoster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          };

          setSelectMovie(parseMovie);
        }
      })
      .catch(() => setError('network error'))
      .finally(() => setSearch(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={hadleSumbmit}>
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
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': search })}
              disabled={query.trim() === ''}
            >
              {!selectMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {selectMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {selectMovie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectMovie} />
        </div>
      )}
    </>
  );
};
