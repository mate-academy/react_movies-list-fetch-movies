import React, { useState } from 'react';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const findMovie = async () => {
    if (!title) {
      return;
    }

    setIsLoading(true);
    setError('');

    const data = await getMovie(title);

    setIsLoading(false);

    if ('Error' in data) {
      setError("Can't find a movie with such a title");
      setMovie(null);
    } else {
      const movieData = data as MovieData;

      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster !== 'N/A'
            ? movieData.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }
  };

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    findMovie();
  };

  const addMovie = () => {
    if (movie) {
      onAdd(movie);
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
