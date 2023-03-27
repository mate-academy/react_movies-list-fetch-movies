import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

function getMovieFromMovieDetails({
  Title,
  Plot,
  Poster,
  imdbID,
}: MovieData): Movie {
  return {
    title: Title,
    description: Plot,
    imgUrl: Poster !== 'N/A'
      ? Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleFindMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(movieDetails => {
        if ('Response' in movieDetails && movieDetails.Response === 'False') {
          setError("Can't find a movie with such a title");
        } else {
          setMovie(getMovieFromMovieDetails(movieDetails as MovieData));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie !== undefined) {
      addMovie(movie);
      setQuery('');
      setMovie(undefined);
    }
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={handleFindMovie}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie !== undefined && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
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
