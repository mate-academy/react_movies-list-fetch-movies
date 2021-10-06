import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onMovieAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC <Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  const handleRequest = (movieTitle: string) => {
    setMovie({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });

    fetch(`https://www.omdbapi.com/?apikey=e45c8c40&t=${movieTitle}`)
      .then(response => response.json())
      .then(result => {
        if (result.Response !== 'False') {
          setMovie(result);
        } else {
          setError(true);
        }
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    if (movie.Title.length > 0) {
      onMovieAdd(movie);
    }

    setMovie({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });

    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    setError(false);
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
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className="input is-danger"
                onChange={handleChange}
              />
            </div>
          </label>
          {error
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => handleRequest(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.Title.length > 0
        && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
