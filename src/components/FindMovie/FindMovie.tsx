import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

interface Props {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [input, setInput] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setError(false);
  };

  const handleFindMovie = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(input)
      .then(data => {
        if ('Error' in data) {
          setError(true);

          return;
        }

        const movieData = data as MovieData;

        setPreviewMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    setError(false);
    setInput('');
    setPreviewMovie(null);

    const movieToAdd = previewMovie as Movie;

    if (movies.find(movie => movie.imdbId === movieToAdd.imdbId)) {
      return;
    }

    setMovies([...movies, movieToAdd]);
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={input}
              onChange={handleInput}
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
              disabled={input.trim() === ''}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {!isLoading && previewMovie && (
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

      {!isLoading && previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
