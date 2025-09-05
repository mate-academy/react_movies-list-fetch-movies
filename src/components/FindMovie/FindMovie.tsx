import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

interface Props {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const normalizeMovie = (data: MovieData): Movie => ({
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(title)
      .then(res => {
        if (!res || 'Error' in res) {
          setError("Can't find a movie with such a title");
          setMovie(null);
        } else {
          setMovie(normalizeMovie(res));
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddButton = (m: Movie) => {
    const res = movies.some(movieFromList => movieFromList.imdbId === m.imdbId);

    if (!res) {
      addMovie(movie);
    }

    setMovie(null);
    setTitle('');
    setError('');
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError('');
              }}
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
              disabled={title.trim().length === 0}
              className={`button is-light ${loading ? 'is-loading' : ''}`}
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
                onClick={() => handleAddButton(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
