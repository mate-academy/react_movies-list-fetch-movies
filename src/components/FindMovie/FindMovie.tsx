import React, { useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview'; // eslint-disable-line

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setISLoading] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);

  const handleQueryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setISLoading(true);

    const movieData = await getMovie(query);

    if ('Error' in movieData) {
      setIsLoadingError(true);
    } else {
      const newMovie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster !== 'N/A'
          ? movieData.Poster
          : defaultPicture,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovie(newMovie);
    }

    setISLoading(false);
  };

  const handleClearInput = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
    }

    handleClearInput();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={`input ${isLoadingError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQueryInput}
            />
          </div>

          {isLoadingError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
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
              disabled={!query}
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
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
