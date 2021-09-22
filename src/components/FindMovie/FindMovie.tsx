import React, { useState } from 'react';
import './FindMovie.scss';
import { loadMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const findMovie = async (e: React.FormEvent) => {
    e.preventDefault();

    const movie = await loadMovie(title);

    setError('');
    if (movie.Response !== 'False') {
      setFoundedMovie(movie);
    } else {
      setError('Can\'t find a movie with such a title');
    }
  };

  const handleMovieAdd = () => {
    if (foundedMovie) {
      const newMovie = {
        Poster: foundedMovie.Poster,
        Title: foundedMovie.Title,
        Plot: foundedMovie.Plot,
        imdbID: foundedMovie.imdbID,
      };

      addMovie(newMovie);
    }

    setFoundedMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              onChange={handleInput}
              className="input is-danger"
            />
          </div>

          <p className="help is-danger">
            {error}
          </p>

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              onClick={handleMovieAdd}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundedMovie
          && <MovieCard movie={foundedMovie} />}
      </div>
    </>
  );
};
