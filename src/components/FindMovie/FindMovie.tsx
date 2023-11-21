import React, { useRef, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (movie: Movie[]) => void;
  movies: Movie[];
};

// eslint-disable-next-line max-len
const defaultImgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
const url = 'https://www.imdb.com/title/';

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [
    movieFromServer,
    setMovieFromServer,
  ] = useState<MovieData | ResponseError>({
    Response: 'False',
    Error: 'Movie not Found!',
  });

  const isError = useRef(false);
  let movie: Movie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isError.current = false;
    setIsLoading(true);

    const normalizeQuery = query.toLowerCase();

    if (movieFromServer.Response === 'False') {
      isError.current = true;
    }

    getMovie(normalizeQuery)
      .then(movieData => {
        setIsErrorMessage(true);
        setMovieFromServer(movieData);
      })
      .catch()
      .finally(() => setIsLoading(false));
  };

  const addMovie = () => {
    const isId = movies.find(movie1 => movie1.imdbId === movie.imdbId);

    if (!isId) {
      setMovies([...movies, movie]);
    }

    isError.current = false;
    setQuery('');
    setMovieFromServer({
      Response: 'False',
      Error: 'Movie not Found!',
    });
  };

  if (movieFromServer.Response === 'True') {
    movie = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster === 'N/A'
        ? defaultImgUrl
        : movieFromServer.Poster,
      imdbId: movieFromServer.imdbID,
      imdbUrl: `${url}${movieFromServer.imdbID}`,
    };

    isError.current = false;
  }

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
              className="input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsErrorMessage(false);
              }}
            />
          </div>

          {(isError.current && isErrorMessage) && (
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
              disabled={!query}
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>

          {movieFromServer.Response === 'True' && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieFromServer.Response === 'True' && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
