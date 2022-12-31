import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { movieDataToMovie } from '../../utils/movieDatatoMovie';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  checkAlreadyExists: (imdbId: string) => boolean;
};

export const FindMovie: React.FC<Props> = ({
  setMovies,
  checkAlreadyExists,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | null>();
  const [loading, setLoading] = useState(false);
  const [isQueryAbsent, setIsQueryAbsent] = useState(false);

  function isMovie(
    object: MovieData | ResponseError,
  ): object is MovieData {
    return (object as MovieData).imdbID !== undefined;
  }

  const handleAddMovie = () => {
    if (movie && !checkAlreadyExists(movie.imdbID)) {
      setMovies(prev => [...prev, movieDataToMovie(movie)]);
    }

    setMovie(null);
    setQuery('');
  };

  const handleQueryChange = (text: string) => {
    setIsQueryAbsent(false);
    setQuery(text);
  };

  const handleMovieRequest = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    setLoading(true);
    getMovie(query.trim())
      .then(result => {
        if (isMovie(result)) {
          setMovie({
            ...result,
            Poster: result.Poster.startsWith('https')
              ? result.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          });
        } else {
          setIsQueryAbsent(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
              onChange={e => handleQueryChange(e.target.value)}
            />
          </div>

          {isQueryAbsent && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': loading },
              )}
              disabled={loading || !query}
              onClick={(e) => handleMovieRequest(e)}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movieDataToMovie(movie)} />
          </div>
        )}
    </>
  );
};
