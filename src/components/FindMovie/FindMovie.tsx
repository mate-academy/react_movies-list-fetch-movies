import React, { useState } from 'react';
import cn from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[];
  addMovie: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [titleQuery, setTitleQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isMovieInList, setIsMovieInList] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadMovie = async () => {
    setIsMovieLoading(true);

    const findedMovie = await getMovie(titleQuery);

    if ('Error' in findedMovie) {
      setIsError(true);
      setIsMovieLoading(false);
    } else {
      setMovie({
        title: findedMovie.Title,
        description: findedMovie.Plot,
        imgUrl: findedMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : findedMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${findedMovie.imdbID}`,
        imdbId: findedMovie.imdbID,
      });

      setIsMovieLoading(false);
      setIsError(false);
    }
  };

  const addMovieToListHandler = () => {
    if (movies.find(currentMovie => currentMovie.imdbId === movie?.imdbId)) {
      setIsMovieInList(true);
      setTitleQuery('');
      setMovie(null);
    } else if (movie) {
      addMovie([...movies, movie]);
      setTitleQuery('');
      setMovie(null);
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
    setIsMovieInList(false);
    setIsError(false);
  };

  const onSubmitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    loadMovie();
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
              value={titleQuery}
              onChange={onChangeHandler}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isMovieInList && (
            <p className="help is-danger" data-cy="errorMessage">
              Movie is alredy in the movies list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light',
                { 'is-loading': isMovieLoading })}
              disabled={!titleQuery.trim()}
              onClick={onSubmitHandler}
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
                onClick={addMovieToListHandler}
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
