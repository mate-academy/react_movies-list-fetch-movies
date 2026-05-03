import React from 'react';
import './FindMovie.scss';
import { useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  addMovie: (movie: Movie) => void;
}

export const FindMovie = ({ addMovie }: FindMovieProps) => {
  const [title, setTitle] = useState(''); // стан для значення інпута
  const [isError, setIsError] = useState(false);
  const query = title.trim();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      return;
    }

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setIsError(true);
          setMovie(null); // ⬅️ очищаємо UI-модель

          return;
        }

        setIsError(false);

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

        setMovie(normalizedMovie); // ⬅️ тепер все сходиться по типах
      })
      .finally(() => {
        setIsLoading(false);
      });
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
              className={isError ? 'input is-danger' : 'input'}
              value={title}
              onChange={handleChange}
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
              data-cy="searchButton"
              type="submit"
              disabled={!query || isLoading}
              className={
                isLoading ? 'button is-light is-loading' : 'button is-light'
              }
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
                onClick={() => {
                  if (!movie) {
                    return;
                  }

                  addMovie(movie);
                  setTitle('');
                  setMovie(null);
                }}
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
