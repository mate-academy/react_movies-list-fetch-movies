import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  handleAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [moviesTitle, setMovieTitle] = useState<string>('');
  const [movieIsFound, setMovieIsNotFound] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const changeDataIntoMovie = (movieData: MovieData) => {
    const changeDataInMovie: Movie = {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };

    return changeDataInMovie;
  };

  const handleSearchButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoader(true);
    setMovieIsNotFound(false);

    getMovie(moviesTitle)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setMovie(undefined);
          setMovieIsNotFound(true);

          return;
        }

        const moviesState = changeDataIntoMovie(response);

        setMovie(moviesState);
        setMovieIsNotFound(false);
        setLoader(true);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleAddButton = () => {
    if (movie) {
      handleAddMovie(movie);
    }

    setMovie(undefined);
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
              className="input"
              value={moviesTitle}
              onChange={e => {
                setMovieTitle(e.target.value);
                setMovieIsNotFound(false);
              }}
            />
          </div>

          {!movie && movieIsFound && (
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
                'is-loading': loader,
              })}
              onClick={e => handleSearchButton(e)}
              disabled={moviesTitle === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && moviesTitle && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie !== undefined && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
