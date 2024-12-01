import React, { useCallback, useContext, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { DispatchContext } from '../../types/Store';
import classNames from 'classnames';

export const FindMovie: React.FC = () => {
  const [text, setText] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useContext(DispatchContext);

  const handleTitleAdd = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);

      if (error) {
        setError(false);
      }
    },
    [error],
  );

  const handleFindMovie = () => {
    setIsLoading(true);

    getMovie(text)
      .then(res => {
        if ('Error' in res) {
          setError(true);

          return;
        }

        setMovieData(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let movie: Movie | null = null;

  if (movieData) {
    movie = {
      title: movieData.Title,
      description: movieData.Plot,
      imdbId: movieData.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imgUrl:
        movieData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieData.Poster,
    };
  }

  const addMovieToList = () => {
    if (movie === null) {
      return;
    }

    setText('');
    setMovieData(null);
    dispatch({
      type: 'addMovie',
      payload: movie,
    });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleFindMovie();
        }}
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
              value={text}
              onChange={handleTitleAdd}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          {text.length > 0 || (text.length === 0 && movieData) ? (
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                // className="button is-light"
                className={classNames('button is-light', {
                  'is-loading': isLoading,
                })}
                onClick={handleFindMovie}
              >
                {movieData ? 'Search again' : ' Find a movie'}
              </button>
            </div>
          ) : (
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                disabled
              >
                Find a movie
              </button>
            </div>
          )}

          {movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
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
