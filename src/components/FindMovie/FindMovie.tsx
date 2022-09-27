import classNames from 'classnames';
import React, {
  ChangeEvent, Dispatch, FormEvent, SetStateAction, useState,
} from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: Dispatch<SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameMovie, setSameMovie] = useState(false);

  const handleFindMovie = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setClicked(true);
    setIsLoading(true);
    const data = await getMovie(query);

    if (!('Error' in data)) {
      setError(false);

      const {
        Plot, Poster, Title, imdbID,
      } = data;

      // eslint-disable-next-line
      const defaultPic = 'https://via.placeholder.com/360x270.png?text=no%20preview';

      setMovie({
        title: Title,
        description: Plot,
        imdbId: imdbID,
        imgUrl: (Poster === 'N/A' ? defaultPic : Poster),
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      });
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  const handleMovieQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
    setSameMovie(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      setMovies((currentMovies) => {
        if (!currentMovies.find(mov => mov.imdbId === movie.imdbId)) {
          return ([
            ...currentMovies,
            movie,
          ]);
        }

        setSameMovie(true);

        return currentMovies;
      });
    }

    setMovie(null);
    setQuery('');
    setClicked(false);
    setError(false);
  };

  return (
    <>
      <form onSubmit={(event) => handleFindMovie(event)} className="find-movie">
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
              onChange={handleMovieQuery}
            />
          </div>

          {error
          && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {sameMovie
          && (
            <p className="help is-danger">
              This movie has already been added to the list
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query.trim()}
            >
              {!clicked
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>
          {movie
          && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
          <MovieCard movie={movie} />

        </div>
      )}
    </>
  );
};
