import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MemoMovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query.toLowerCase().trim())
      .then(res => {
        if ((res as ResponseError).Response === 'False') {
          setError((res as ResponseError).Error);
        } else {
          const fetchedMovie = res as MovieData;
          setFindedMovie({
            title: fetchedMovie.Title,
            description: fetchedMovie.Plot,
            imgUrl:
              !fetchedMovie.Poster || fetchedMovie.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : fetchedMovie.Poster,
            imdbUrl: `https://www.imdb.com/title/${fetchedMovie.imdbID}`,
            imdbId: fetchedMovie.imdbID,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClickAdd = (movie: Movie) => {
    onAdd(movie);
    setQuery('');
    setFindedMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleQueryChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {findedMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleClickAdd(findedMovie);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MemoMovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
