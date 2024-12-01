import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onSubmit: (value: Movie) => void;
}

function transformMovieData(movieData: MovieData): Movie {
  const imgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  const imdbUrl = `https://www.imdb.com/title/${movieData.imdbID}`;

  const movie: Movie = {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster !== 'N/A' ? movieData.Poster : imgUrl,
    imdbUrl,
    imdbId: movieData.imdbID,
  };

  return movie;
}

export const FindMovie: React.FC<Props> = ({ onSubmit }) => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [moviesFromServer, setMoviesFromServer] = useState<MovieData | null>(
    null,
  );

  const transformedMovieData =
    moviesFromServer && transformMovieData(moviesFromServer);

  const getMovieFromServer = () => {
    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setIsError(true);
        } else {
          setMoviesFromServer(data);
          setIsError(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleSearchButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    getMovieFromServer();
    setLoading(true);
  };

  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (transformedMovieData) {
      onSubmit(transformedMovieData);
      setMoviesFromServer(null);
      setQuery('');
    }
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
              value={query}
              onChange={handleQueryChange}
              className={cn('input', {
                'is-danger': isError,
              })}
            />
          </div>
          {isError && (
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
              disabled={query === ''}
              onClick={event => handleSearchButtonClick(event)}
            >
              Find a movie
            </button>
          </div>
          {moviesFromServer && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => handleAddButtonClick(event)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {transformedMovieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={transformedMovieData} />
        </div>
      )}
    </>
  );
};
