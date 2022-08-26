import React, { FormEvent, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
// import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchQuery)
      .then(result => {
        if ('Error' in result) {
          setError(true);
          setMovie(null);

          return;
        }

        const {
          Poster, Title, Plot, imdbID,
        } = result;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster
            || 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        setError(false);
      })
      .catch(() => setError(true))
      .finally(
        () => setIsLoading(false),
      );
  };

  const handleClick = () => {
    if (movie) {
      addMovie(movie);
    }

    setSearchQuery('');
    setMovie(null);
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
              className="input is-dander"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setError(false);
              }}
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
              className={cn('button is-light',
                { 'is-loading': isLoading })}
              disabled={!searchQuery}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClick}
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
