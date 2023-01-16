/* eslint-disable no-console */
import { FC, useState, Dispatch } from 'react';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie, placeholder } from '../../api';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  setMovies: Dispatch<React.SetStateAction<Movie[]>>,
};

export const FindMovie: FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const createCard = (newMovie: MovieData) => ({
    title: newMovie.Title,
    description: newMovie.Plot,
    imgUrl: newMovie.Poster === 'N/A'
      ? placeholder
      : newMovie.Poster,
    imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
    imdbId: newMovie.imdbID,
  });

  const fetchMovie = async (title: string) => {
    const movieData = await getMovie(title);

    if ((movieData as MovieData).imdbID) {
      setMovie(createCard(movieData as MovieData));
      setIsLoading(false);
      setIsVisible(false);

      return;
    }

    setIsLoading(false);
    setIsVisible(true);
  };

  const addMovie = () => {
    if (movie) {
      setMovies((current) => {
        return current.some(({ imdbId }) => imdbId === movie.imdbId)
          ? current
          : [...current, movie];
      });
      setMovie(null);
      setQuery('');
      setIsVisible(false);
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    fetchMovie(query);
    setIsLoading(true);
  };

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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsVisible(false);
              }}
            />
          </div>

          {isVisible && (
            <p className="help is-danger" data-cy="errorMessage">
              {`Can't find a movie with such a title`}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!query.length}
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
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
                onClick={addMovie}
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
