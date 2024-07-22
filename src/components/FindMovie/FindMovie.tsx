import './FindMovie.scss';
import React, { useState } from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (arg: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [showError, setShowError] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(response => {
        if (response.Response === 'True') {
          setSearchedMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster !== 'N/A'
                ? response.Poster
                : `https://via.placeholder.com/360x270.png?text=no%20preview`,
            imdbId: response.imdbID,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          });
          setShowError(false);
        } else {
          setShowError(true);
        }
      })

      .catch(reason => {
        throw new Error(reason);
      })

      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (searchedMovie) {
      addMovie(searchedMovie);
      setQuery('');
      setSearchedMovie(null);
    }
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setShowError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={'input ' + (showError ? 'is-danger' : '')}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {showError && (
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
              className={'button is-light ' + (loading ? 'is-loading' : '')}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
                disabled={!searchedMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchedMovie} />
        </div>
      )}
    </>
  );
};
