/* eslint-disable max-len */
import React, { useEffect, useState, useCallback } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard/MovieCard';

interface Props {
  addNewMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
  existingMovies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ addNewMovie, existingMovies }) => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null | ResponseError>(null);
  const [movieInfo, setMovieInfo] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const formSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (searchTitle.trim() !== '') {
      getMovie(searchTitle)
        .then(movieFromAPI => {
          setMovieData(movieFromAPI);
        })
        .finally(() => setLoading(false));
    }
  }, [searchTitle]);

  useEffect(() => {
    if (movieData !== null && 'Poster' in movieData) {
      const newMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovieInfo(newMovie);
    } else if (movieData !== null && movieData.Error) {
      setError(true);
    }
  }, [movieData]);

  const onAddMovie = useCallback(() => {
    if (movieInfo) {
      const movieExists = existingMovies.some((movie) => movie.imdbId === movieInfo.imdbId);

      if (!movieExists) {
        addNewMovie((prevMovies: Movie[]) => [...prevMovies, movieInfo]);
      }
    }

    setSearchTitle('');
    setMovieInfo(null);
  }, [movieInfo]);

  const onTitleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.currentTarget.value);
    setError(false);
  }, [searchTitle]);

  return (
    <>
      <form className="find-movie" onSubmit={(event) => formSubmit(event)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={searchTitle}
              onChange={event => onTitleInput(event)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn({
                'input is-danger': error,
                input: !error,
              })}
            />
          </div>

          {error
          && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={loading || searchTitle.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movieInfo
            && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {movieInfo
        && (
          <div className="container" data-cy="previewContainer">

            <h2 className="title">Preview</h2>
            <MovieCard movie={movieInfo} />
          </div>
        )}
    </>
  );
};
