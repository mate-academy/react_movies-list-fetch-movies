import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[]
  setMovies:(movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handlerFindMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setLoaded(true);
    getMovie(query.trim())
      .then(result => {
        if ('Title' in result) {
          const {
            Poster, Title, Plot, imdbID,
          } = result;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A' ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
        }
      })
      .finally(() => {
        setLoaded(false);
      });
  };

  const handlerAddMovie = () => {
    if (movie && !movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handlerFindMovie}>
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
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={handlerInput}
            />
          </div>
          { isError && (
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
              disabled={query === ''}
              className={cn('button is-light', { 'is-loading': loaded })}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          { movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      { movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
