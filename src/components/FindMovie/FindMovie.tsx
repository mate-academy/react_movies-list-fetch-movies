import React, { useState } from 'react';
import CN from 'classnames';
import { getMovie, defaultPicture } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setISLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const handleQueryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError('');
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setIsError('Please enter a movie title');
      setISLoading(false);

      return;
    }

    setISLoading(true);

    const movieData = await getMovie(query);

    if ('Error' in movieData) {
      setIsError('Can\'t find a movie with such title');
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
              className={CN('input', { 'is-danger': isError })}
              value={query}
              onChange={handleQueryInput}

            />
          </div>

          {isError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              {isError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={CN('button', 'is-light', { 'is-loading': isLoading })}
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
