import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
  movie,
  setMovie,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isErrorShowed, setIsErrorShowed] = useState(false);

  const createMovie = (receivedMovie: MovieData) => {
    setMovie({
      title: receivedMovie.Title,
      description: receivedMovie.Plot,
      imgUrl: receivedMovie.Poster
        || 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: receivedMovie.imdbID,
      imdbId: receivedMovie.imdbID,
    });
  };

  const findMovie = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDataLoading(true);
    getMovie(inputValue)
      .then((res) => {
        if ('Error' in res) {
          setIsErrorShowed(true);
        } else {
          createMovie(res);
        }
      })
      .finally(() => setIsDataLoading(false));
  };

  const handleMovieAdd = () => {
    if (movie && !movies.some(item => item.imdbId === movie?.imdbId)) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setInputValue('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => findMovie(event)}
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
              className="input is-dander"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsErrorShowed(false);
              }}
            />
          </div>

          {isErrorShowed && (
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
              disabled={inputValue.trim() === ''}
              className={classNames(
                'button is-light',
                {
                  'is-loading': isDataLoading,
                },
              )}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleMovieAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>

        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
