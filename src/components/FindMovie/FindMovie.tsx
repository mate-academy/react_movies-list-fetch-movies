import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { getMovie } from '../../api';
//import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [prevMovie, setPrevMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError(false);

    getMovie(query)
      .then(data => {
        if (data.Response === 'False') {
          setError(true);
          setPrevMovie(null);

          return;
        }

        //const movieData = data as MovieData;
        const normalizedMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbId: data.imdbID,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        };

        setPrevMovie(normalizedMovie);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (!prevMovie) {
      return;
    }

    onAddMovie(prevMovie);
    setQuery('');
    setPrevMovie(null);
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
              value={query}
              onChange={handleQueryChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
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
              //onClick={handleAdd}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {prevMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {prevMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={prevMovie} />
        </div>
      )}
    </>
  );
};
