import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [searchValue, setSearchValue] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMovie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchValue)
      .then((movieData) => {
        if (movieData.Response === 'True') {
          const {
            Title: title,
            Plot: description,
            Poster,
            imdbID: imdbId,
          } = movieData;

          const imgUrl = Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

          const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

          setFoundMovie({
            title,
            description,
            imgUrl,
            imdbUrl,
            imdbId,
          });
        }

        if (movieData.Response === 'False') {
          setError(true);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setError(false);
  };

  const handleAddMovieButton = () => {
    onAddMovie(foundMovie as Movie);
    setFoundMovie(null);
    setSearchValue('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
              value={searchValue}
              onChange={handleSearchInput}
            />
          </div>

          {error
          && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!searchValue.length}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieButton}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {foundMovie
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
