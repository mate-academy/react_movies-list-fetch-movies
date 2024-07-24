import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [userInput, setUserInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMovieButton = useCallback(() => {
    if (movie && !movies.find(item => item.imdbId === movie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }

    setUserInput('');
    setMovie(null);
  }, [movie, movies]);

  const handleFindMovieButton = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    const movieFromServer = await getMovie(userInput).finally(() =>
      setIsLoading(false),
    );

    if ('Error' in movieFromServer) {
      setError(movieFromServer);
    } else {
      setMovie({
        imdbId: movieFromServer.imdbID,
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl:
          movieFromServer.Poster !== 'N/A'
            ? movieFromServer.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      });
    }
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(event.target.value);
      setError(null);
    },
    [],
  );

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={userInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !!error,
              })}
              onChange={handleInputChange}
            />
          </div>

          {error?.Error === 'Movie not found!' && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!userInput}
              onClick={handleFindMovieButton}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieButton}
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
