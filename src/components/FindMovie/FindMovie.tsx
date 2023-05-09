import React, { memo, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onSetMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = memo(({ onSetMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingError(false);
    setQuery(event.target.value);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);

    try {
      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        setIsLoadingError(true);
      } else {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = movieData;

        const imgUrl = Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster;

        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(newMovie);
      }
    } catch (error) {
      setIsLoadingError(true);
      throw new Error(`Error: ${error}`);
    } finally {
      setIsloading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      onSetMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
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
              className={cn('input', { 'is-dander': isLoadingError })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {isLoadingError && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
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
});
