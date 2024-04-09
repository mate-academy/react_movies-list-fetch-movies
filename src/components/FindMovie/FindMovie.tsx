import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlerInputChange = (value: string) => {
    setError(false);
    setTitle(value);
  };

  const handleAdd = () => {
    const dupe = movies.find(m => m.imdbId === movie?.imdbId);

    if (dupe) {
      setTitle('');
      setMovie(null);

      return;
    }

    if (movie) {
      setMovies(state => [...state, movie]);
      setMovie(null);
      setTitle('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);

    getMovie(title.trim())
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setMovie(null);
        } else {
          const { Poster, Title, Plot, imdbID } = data;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl:
              Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setTitle('');
      });
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={event => handlerInputChange(event.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!title}
              data-cy="searchButton"
              type="submit"
              className={
                isLoading ? 'button is-light is-loading' : 'button is-light '
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                onClick={handleAdd}
                data-cy="addButton"
                type="button"
                className="button is-primary"
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
