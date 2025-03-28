import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import cn from 'classnames';

interface Props {
  movieList: Movie[];
  // onMovies: (updateFn: (movies: Movie[]) => Movie[]) => void;
  onMovies: (key: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = React.memo(
  ({ onMovies, movieList }) => {
    const [title, setTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [movie, setMovie] = useState<MovieData | null>(null);
    const [movieCard, setMovieCard] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      const DEFAULT_POSTER =
        'https://via.placeholder.com/360x270.png?text=no%20preview';

      const DEFAULT_URL = 'https://www.imdb.com/title/';

      if (movie) {
        const card: Movie = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster || DEFAULT_POSTER,
          imdbId: movie.imdbID,
          imdbUrl: DEFAULT_URL + movie.imdbID,
        };

        setMovieCard(card);
      } else {
        setMovieCard(null);
      }
    }, [movie]);

    const handleCleanList = () => {
      localStorage.removeItem('movieList');
      onMovies([]);
    };

    const handleAddList = () => {
      const checkIncludes = () => {
        return movieList.every(m => m.imdbId !== movieCard?.imdbId);
      };

      if (movieCard && checkIncludes()) {
        onMovies([...movieList, movieCard]);
        setMovieCard(null);
        // onMovies(data => [...data, movieCard]);
      }
    };

    const handleSerch = (query: string) => {
      setLoading(true);

      getMovie(query)
        .then(response => {
          if (!('Error' in response)) {
            setErrorMessage('');
            setMovie(response);
            // eslint-disable-next-line no-console
            console.log(response);

            return;
          }

          // eslint-disable-next-line no-console
          console.error(response.Error);
          setErrorMessage(response.Error);
          setMovie(null);
          // setErrorMessage("Can't find a movie with such a title");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!title.length) {
        setErrorMessage(`Can't find a movie with such a title`);

        return;
      }

      setErrorMessage('');
      handleSerch(title);
    };

    return (
      <>
        <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
                className={cn('input', { 'is-danger': errorMessage })}
                value={title}
                onChange={e => handleInput(e)}
              />
            </div>

            {errorMessage && (
              <p className="help is-danger" data-cy="errorMessage">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={cn('button is-light', { 'is-loading': loading })}
                disabled={!title.length}
              >
                Find a movie
              </button>
            </div>

            {!errorMessage && movieCard && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => handleAddList()}
                >
                  Add to the list
                </button>
              </div>
            )}
          </div>

          {Boolean(movieList.length) && (
            <div className="control">
              <button
                type="button"
                className="button is-danger"
                onClick={() => handleCleanList()}
              >
                Clean List
              </button>
            </div>
          )}
        </form>

        {movieCard && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movieCard} />
          </div>
        )}
      </>
    );
  },
);

FindMovie.displayName = 'FindMovie';
