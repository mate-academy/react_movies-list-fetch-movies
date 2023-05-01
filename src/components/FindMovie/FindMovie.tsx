import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
// import { ResponseError } from '../../types/ReponseError';

type Props = {
  handleMoviesAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ handleMoviesAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);

  const getNewMovie = ({
    Poster,
    Title,
    Plot,
    imdbID,
  }: MovieData) => {
    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: '',
      imdbId: imdbID,
    };

    setMovie(newMovie);
  };

  const loadMovies = async () => {
    setIsLoadingMovie(true);
    setHasLoadingError(false);
    try {
      const movieData = await getMovie(query)
        .finally(() => setIsLoadingMovie(false));

      if ('Error' in movieData) {
        setMovie(null);
        throw new Error('Error');
      } else {
        getNewMovie(movieData as MovieData);
      }
    } catch (error) {
      setHasLoadingError(true);
    }
  };

  const handleFindMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    loadMovies();
    setIsLoadingMovie(true);
  };

  const handleAddFilm = (film: Movie) => {
    handleMoviesAdd(film);
    setQuery('');
    setMovie(null);
    setIsLoadingMovie(false);
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
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          { hasLoadingError && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoadingMovie })}
              onClick={handleFindMovie}
              disabled={!query}
            >
              { isLoadingMovie && query ? 'Search Movie' : 'Find a movie' }
            </button>
          </div>

          <div className="control">
            { movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddFilm(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
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
