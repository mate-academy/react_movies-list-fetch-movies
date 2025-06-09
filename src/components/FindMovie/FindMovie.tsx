import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  addMovieToList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, addMovieToList }) => {
  const [titleValue, setTitleValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);

  const onTitleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
    setIsErrorMessageVisible(false);
  };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitleValue = titleValue.trim();

    if (!trimmedTitleValue) {
      return;
    }

    setIsLoading(true);
    setIsErrorMessageVisible(false);
    setMovie(null);

    getMovie(trimmedTitleValue)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setMovie(null);
          setIsErrorMessageVisible(true);

          return;
        }

        const movieData = data as MovieData;

        const findMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setMovie(findMovie);
      })
      .catch(() => setIsErrorMessageVisible(true))
      .finally(() => setIsLoading(false));
  };

  const onAddMovie = () => {
    if (!movie) {
      return;
    }

    const isMovieAlreadyAtList = movies.some(m => m.imdbId === movie?.imdbId);

    if (!isMovieAlreadyAtList) {
      addMovieToList(movie);
    }

    setMovie(null);
    setTitleValue('');
    setIsErrorMessageVisible(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSearch}>
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
              className={cn('input', {
                'is-danger': isErrorMessageVisible,
              })}
              value={titleValue}
              onChange={onTitleValueChange}
            />
          </div>

          {isErrorMessageVisible && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!titleValue.trim() || isLoading}
            >
              Find a movie
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
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
