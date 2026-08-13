import React, { FormEvent } from 'react';
import { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

const DEFAULT_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getMovie(query.trim())
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setFindedMovie(null);
          setErrorMessage(data.Error);

          return;
        }

        const movieData = data as MovieData;

        const normalizedMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster === 'N/A' ? DEFAULT_IMAGE : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setFindedMovie(normalizedMovie);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (!findedMovie) {
      return;
    }

    onAdd(findedMovie);
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
              className="input is-danger"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? `is-loading` : ''}`}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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

          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
