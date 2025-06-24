import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  addMovie: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const resetForm = () => {
    setMovie(null);
    setTitle('');
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (!title.trim()) {
      return;
    }

    getMovie(title)
      .then(movieData => {
        if ((movieData as ResponseError).Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie({
          title: (movieData as MovieData).Title,
          description: (movieData as MovieData).Plot,
          imgUrl:
            (movieData as MovieData).Poster === 'N/A' ||
            !(movieData as MovieData).Poster
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : (movieData as MovieData).Poster,
          imdbUrl: `https://www.imdb.com/title/${(movieData as MovieData).imdbID}`,
          imdbId: (movieData as MovieData).imdbID,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const onAddMovie = () => {
    if (!movie) {
      return;
    }

    if (movies.find(m => m.imdbId === movie.imdbId)) {
      resetForm();

      return;
    }

    addMovie([...movies, movie]);
    resetForm();
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={`input ${error && 'is-danger'}`}
              value={title}
              onChange={e => onTitleChange(e)}
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
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading && 'is-loading'}`}
              disabled={!title.trim()}
              onSubmit={onSubmit}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
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
