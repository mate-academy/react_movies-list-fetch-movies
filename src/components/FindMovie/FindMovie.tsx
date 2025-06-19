import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  handleAddButton: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ handleAddButton, movies }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    getMovie(title.trim())
      .then(result => {
        if ('Response' in result && result.Response === 'False') {
          setMovie(null);
          setError(true);
        } else {
          const movieData = result as MovieData;
          const normalizedMovie: Movie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster === 'N/A'
                ? `https://via.placeholder.com/360x270.png?text=no%20preview`
                : movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setMovie(normalizedMovie);
          setError(false);
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
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
                onClick={() => {
                  if (
                    movies.some(existing => existing.imdbId === movie.imdbId)
                  ) {
                    setTitle('');
                    setMovie(null);

                    return;
                  }

                  handleAddButton(movie);
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
