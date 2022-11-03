import React, { FormEvent, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query).then((MovieData) => {
      if ('Error' in MovieData) {
        return Promise.reject();
      }

      setFoundedMovie({
        title: MovieData.Title,
        description: MovieData.Plot,
        imgUrl: MovieData.Poster === 'N/A' ? (
          'https://via.placeholder.com/360x270.png?text=no%20preview'
        ) : (
          MovieData.Poster
        ),
        imdbUrl: `https://www.imdb.com/title/${MovieData.imdbID}`,
        imdbId: MovieData.imdbID,
      });

      return Promise.resolve();
    })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  const handleFilmAdding = () => {
    if (foundedMovie) {
      addMovie(foundedMovie);
    }

    setQuery('');
    setFoundedMovie(null);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="find-movie"
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
              defaultValue={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              type="submit"
              data-cy="searchButton"
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundedMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleFilmAdding}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {foundedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundedMovie} />
        </div>
      )}
    </>
  );
};
