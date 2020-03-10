import React, {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';

import cn from 'classnames';
import './FindMovie.scss';
import { getData } from '../../api/getData';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie) => void;
  movies: Movies;
}

export const FindMovie: FC<Props> = ({ addMovie, movies }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null >(null);
  const [error, setError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setMovieTitle(value);
  };

  const findMovie = async () => {
    const movie: MovieFromServer = await getData(movieTitle);
    const baseMovieUrl = 'https://www.imdb.com/title/';

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response: response,
    } = movie;

    if (response === 'True') {
      const imdbUrl = baseMovieUrl + imdbId;
      const foundMovie = {
        title,
        description,
        imgUrl,
        imdbId,
        imdbUrl,
      };

      setNewMovie(foundMovie);
      setError(false);
    } else {
      setNewMovie(null);
      setError(true);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie();
  };

  const isMovieAdded = movies.some(oldMovie => oldMovie.title === newMovie?.title);

  const handleAdd = () => {
    if (newMovie && !isMovieAdded) {
      addMovie(newMovie);
    }

    setNewMovie(null);
    setMovieTitle('');
    setError(false);
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
              onChange={handleChange}
              value={movieTitle}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': error,
              })}
            />
          </div>

          {error
            ? (
              <p className="help is-danger">
            Can&apos;t find a movie with such a title
              </p>
            ) : null}

          {isMovieAdded
            ? (
              <p className="help is-danger">
            This movie is already in the list
              </p>
            ) : null}
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
              className="button is-primary"
              onClick={handleAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie
          ? <MovieCard {...newMovie} />
          : null}
      </div>
    </>
  );
};
