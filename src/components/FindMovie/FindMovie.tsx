import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

interface Props {
  setMovie: (movie: Movie | null) => void,
  movie: Movie | null,
  setMovies: (movie: Movie[]) => void,
  movies: Movie[],
}

const createMyvieObject = (response: MovieData): Movie => {
  return {
    title: response.Title,
    description: response.Plot,
    imgUrl: response.Poster,
    imdbUrl: response.imdbID,
    imdbId: response.imdbID,
  };
};

export const FindMovie: React.FC<Props> = (props) => {
  const {
    setMovie, movie, setMovies, movies,
  } = props;

  const [query, setQuery] = useState('');
  const [errorSearch, setErrorSearch] = useState<ResponseError | null>(null);
  const [isLoad, setIsLoad] = useState(false);

  const handelSearchMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoad(true);
    getMovie(query)
      .then(responseMovie => {
        setIsLoad(false);
        const data = responseMovie;

        if ('Error' in data) {
          setErrorSearch(data);
        } else {
          const movieFormating = createMyvieObject(data);

          setMovie(movieFormating);
        }
      });
    setQuery('');
    setMovie(null);
  };

  const handelAddMovie = () => {
    if (movie && movies.some(item => item.imdbId === movie.imdbId)) {
      setMovie(null);
      setErrorSearch(null);

      return;
    }

    if (movie) {
      setMovies([...movies, movie]);
      setMovie(null);
      setErrorSearch(null);
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
              className="input is-dander"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {
              errorSearch
            && !movie
            && errorSearch.Response === 'False'
            && query === ''
            && errorSearch.Error
            }

          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoad },
              )}
              disabled={query.trim() === ''}
              onClick={handelSearchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handelAddMovie}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        { movie && <MovieCard movie={movie} /> }
      </div>
    </>
  );
};
