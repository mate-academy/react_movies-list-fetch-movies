import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  movies,
  addMovie,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isMovieListed, setIsMovieListed] = useState(false);
  const [hasError, setHasError] = useState(false);

  const clear = () => {
    setMovie(null);
    setQuery('');
    setIsMovieLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
    setIsMovieListed(false);
  };

  const handleAddMovie = (newMovie: Movie) => {
    if (movies.some(prevMovie => prevMovie.imdbId === newMovie.imdbId)) {
      setIsMovieListed(true);
      clear();
    } else {
      addMovie(newMovie);
      clear();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMovieLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setHasError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => setIsMovieLoading(false));
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
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title!
            </p>
          )}

          {isMovieListed && (
            <p className="help is-danger" data-cy="errorMessage">
              This movie is already listed!
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': isMovieLoading },
              )}
              disabled={query.trim() === ''}
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
                onClick={() => handleAddMovie(movie)}
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
