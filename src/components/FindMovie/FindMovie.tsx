import React, { useState, FC } from 'react';

import './FindMovie.scss';
import { API_URL, getData } from '../../api_helpers';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void
  movies: Movie[]
}

export const FindMovie: FC<Props> = ({ addMovie, movies }) => {
  const [queryMovie, setQueryMovie] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: title } = event.target;
    const regExp = /^\s/;

    setQueryMovie(title.replace(regExp, ''));
    setError(false);
    setIsDuplicate(false);
  }

  const searchedMovie = async () => {
    const getMovie = () => {
      return getData(`${API_URL}${queryMovie}`);
    };
    const movieFromApi = await getMovie();

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response: response,
    } = movieFromApi;

    if (response === 'True') {
      const imdbUrl = API_URL + imdbId;
      const newMovie = {
        title, description, imgUrl, imdbId, imdbUrl,
      };
      setNewMovie(newMovie);
      setError(false);
    } else {
      setError(true);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMovie) {
      const { imdbId } = newMovie;
      const replay = movies.some(film => film.imdbId === imdbId);
      setIsDuplicate(replay);
      if (!replay) {
        addMovie(newMovie);
      }
      setQueryMovie('');
    }
    setNewMovie(null);
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
              value={queryMovie}
              className={
                `input ${error ? 'is-danger' : ''}`
              }
              onChange={handleQuery}
            />
          </div>

          {error && <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchedMovie}
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
        {isDuplicate && <p className="help is-danger">
          This movie is already in the list.
        </p>}
        {newMovie && <MovieCard {...newMovie} />}
      </div>
    </>
  )
};
