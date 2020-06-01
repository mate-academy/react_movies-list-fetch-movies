import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { BASE_URL, IMDB_URL } from '../../constans';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFindMovie, setFindMovie] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setQuery(value);
    setFindMovie(false);
  };

  const getMovie = (searchString: string) => {
    return fetch(BASE_URL + searchString)
      .then(movieFromServer => movieFromServer.json());
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    getMovie(query)
      .then(findMovie => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
          Response,
        } = findMovie;

        if (Response === 'True') {
          const imdbUrl = IMDB_URL + imdbId;
          const newMovie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setMovie(newMovie);
        } else {
          setMovie(null);
          setFindMovie(true);
        }
      });
  };

  const onAddMovie = () => {
    if (!movie) {
      return;
    }

    setQuery('');
    addMovie(movie);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              className={cn({ input: true, 'is-danger': isFindMovie })}
              onChange={onChange}
            />
          </div>

          <p className="help is-danger">
            {isFindMovie && 'There is no movie with this title'}
          </p>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} /> }
      </div>
    </>
  );
};
