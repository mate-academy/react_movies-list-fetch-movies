import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
// import movies from '../../api/movies.json';
import { movieLoader } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;

  const [title, setTitle] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findMovie = async (event: React.FormEvent) => {
    event.preventDefault();

    const foundedMovie: FoundedMovie = await movieLoader(title);

    if (foundedMovie.Response === 'False') {
      setError(true);
      setPreviewMovie(null);
    }

    setError(false);

    const movie: Movie = {
      title: foundedMovie.Title,
      description: foundedMovie.Plot,
      imgUrl: foundedMovie.Poster,
      imdbId: foundedMovie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${foundedMovie.imdbID}`,
    };

    setPreviewMovie(movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => findMovie(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        )}

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={(event) => findMovie(event)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!previewMovie}
              onClick={() => addMovie(previewMovie as Movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previewMovie && <MovieCard movie={previewMovie as Movie} />}
      </div>
    </>
  );
};
