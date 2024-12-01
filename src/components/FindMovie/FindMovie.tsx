import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(false);
  };

  const handleAddMovie = () => {
    const uniqMovie = movies.every(
      prevMovie => prevMovie.imdbId !== movie?.imdbId,
    );

    if (movie && uniqMovie) {
      addMovie(movie);
    }

    setTitle('');
    setMovie(null);
  };

  const handleSearchMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title.trim())
      .then((response) => {
        if ('Response' in response && response.Response === 'False') {
          setError(true);
          setMovie(null);
        } else {
          setError(false);

          const res = response as MovieData;

          const newMovie:Movie = {
            title: res.Title,
            description: res.Plot || '',
            imgUrl: res.Poster !== 'N/A'
              ? res.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .catch(() => setError(true))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearchMovie}
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
              className="input"
              onChange={handleInputTitle}
              value={title}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title}
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
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {
        movie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )
      }
    </>
  );
};
