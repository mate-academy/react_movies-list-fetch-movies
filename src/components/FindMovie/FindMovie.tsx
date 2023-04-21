import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  movies, query, setMovies, setQuery,
}) => {
  const [movie, setMovie] = useState<Movie>();
  const [isError, setIsError] = useState<ResponseError>();
  const [isLoading, setIsLoading] = useState(false);

  const addMovie = (movieData: MovieData) => (setMovie({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieData.Poster,
    imdbUrl: 'https://www.imdb.com',
    imdbId: movieData.imdbID,
  }));

  const getMovieData = async (enteredQuery: string) => {
    try {
      setIsLoading(true);
      const response = await getMovie(enteredQuery);

      if ('Response' in response && response.Response === 'False') {
        throw new Error(response.Error);
      } else {
        addMovie(response as MovieData);
      }
    } catch (error) {
      setIsError(error as ResponseError);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddMovie = (movieInfo: Movie) => {
    const isAlreadyAdded = movies.some(
      ({ imdbId }) => imdbId === movieInfo.imdbId,
    );

    if (isAlreadyAdded) {
      return;
    }

    setMovies([...movies, movieInfo]);
    setQuery('');
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {isError && 'There is no movie with such a title'}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              onClick={(event) => {
                event.preventDefault();
                getMovieData(query);
              }}
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
                onClick={() => onAddMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
