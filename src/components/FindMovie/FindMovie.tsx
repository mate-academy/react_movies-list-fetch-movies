import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [text, setText] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setText('');
      setSuccess(false);
    }
  };

  const getMoviesFromApi = async (searchName: string) => {
    setIsLoading(true);
    try {
      const moviesFromApi = await getMovie(searchName);

      if ('Error' in moviesFromApi) {
        setError(true);

        return;
      }

      let { Poster } = moviesFromApi;
      const {
        Title,
        Plot,
        imdbID,
      } = moviesFromApi;

      if (Poster === 'N/A') {
        Poster = 'https://via.placeholder.com/360x270.png?text=no%20preview';
      }

      setMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = ((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text.trim() !== '') {
      getMoviesFromApi(text);
    } else {
      setError(true);
    }
  });

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
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
              value={text}
              onChange={(event) => {
                setError(false);
                setText(event.target.value);
              }}
            />
          </div>

          {error
          && (
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
              disabled={!text}
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>

          {success && (
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
