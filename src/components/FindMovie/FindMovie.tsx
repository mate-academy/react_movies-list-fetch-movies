import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';

type Props = {
  addMovie: (newMovie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const titleChange = (word: string) => {
    setTitle(word);
  };

  const getMovieFromServer = async (movieTitle: string) => {
    const serverMovie: ServerMovie = await getMovies(movieTitle);

    setTitle('');

    setMovie({
      title: serverMovie.Title,
      description: serverMovie.Plot,
      imgUrl: serverMovie.Poster,
      imdbUrl: `https://m.imdb.com/title/${serverMovie.imdbID}`,
      imdbId: serverMovie.imdbID,
    });
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
              value={title}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(event) => {
                event.preventDefault();
                titleChange(event.target.value);
              }}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => getMovieFromServer(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && movie.title && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};
