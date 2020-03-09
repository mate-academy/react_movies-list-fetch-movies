import React, { FC, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { BASE_MOVIE_URL } from '../../constants/constants';
import { getData } from '../../api/getData';

interface Props {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
  };

  const findMovie = async () => {
    const movie: MovieFromServer = await getData(movieTitle);
    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response: response,
    } = movie;

    if (response === 'True') {
      const imdbUrl = BASE_MOVIE_URL + imdbId;
      const findedMovie: Movie = {
        title, description, imgUrl, imdbUrl, imdbId,
      };

      setNewMovie(findedMovie);
      setError(false);
    } else {
      setError(true);
      setNewMovie(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMovie !== null) {
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', error ? 'is-danger' : '')}
              onChange={changeTitle}
              value={movieTitle}
            />
          </div>

          { error
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : null}
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
        {newMovie && <MovieCard {...newMovie} />}
      </div>
    </>
  );
};
