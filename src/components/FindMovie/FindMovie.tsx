import React, { FC, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchedQuery, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isValidQuery, setIsValidQuery] = useState(true);
  const isValidData = (data: MovieData | ResponseError): data is MovieData => {
    return (data as MovieData).Title !== undefined;
  };

  const handleQueryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim()) {
      setIsValidQuery(true);
    }

    setQuery(event.target.value);
    setIsError(false);
  };

  const findMovie = async () => {
    try {
      const foundMovieData = await getMovie(searchedQuery);

      if (isValidData(foundMovieData)) {
        const Poster = foundMovieData.Poster !== 'N/A'
          ? foundMovieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview';

        const { Title, Plot, imdbID } = foundMovieData;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      } else {
        setIsError(true);
        setSubmitted(false);
      }
    } catch {
      setIsError(true);
    } finally {
      setSubmitted(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchedQuery) {
      return;
    }

    if (!searchedQuery.trim()) {
      setIsValidQuery(false);
      setSubmitted(false);

      return;
    }

    findMovie();
    setIsValidQuery(true);
    setSubmitted(true);
  };

  const handleAddMovie = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
    setQuery('');
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
              value={searchedQuery}
              onChange={handleQueryInput}
            />
          </div>
          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {'Can\'t find a movie with such a title'}
            </p>
          )}

          {!isValidQuery && (
            <p className="help is-danger" data-cy="errorMessage">
              Put correct movie name
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button is-light',
                { 'is-loading': isSubmitted },
              )}
              disabled={!searchedQuery}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
              >
                Add to the list
              </button>
            )}
          </div>
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
