import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovies } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [isValid, setValid] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setValid(true);
  };

  const loadMovieAsync = async () => {
    const moviesFromApi = await loadMovies(title);

    if (moviesFromApi.Response === 'False') {
      setValid(false);
      setMovie(null);

      return;
    }

    setMovie({
      title: moviesFromApi.Title,
      description: moviesFromApi.Plot,
      imgUrl: moviesFromApi.Poster,
      imdbUrl: `https://www.imdb.com/title/${moviesFromApi.imdbID}/`,
      imdbId: moviesFromApi.imdbID,
    });

    setTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isValid ? 'input' : 'input is-danger'}
              value={title}
              onChange={handleChange}
            />
          </div>

          {!isValid && (
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
              onClick={loadMovieAsync}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                addMovie(movie as Movie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};
