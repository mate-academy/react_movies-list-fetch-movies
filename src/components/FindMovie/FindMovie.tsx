import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovie';
import './FindMovie.scss';

const URL_IMDB = 'https://www.imdb.com/title/';

interface Props {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: FC<Props> = ({ addMovie, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    setQuery(target.value);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const movieFromApi = await getMovie(query);
    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response: response,
    } = movieFromApi;

    if (response === 'True') {
      const imdbUrl = URL_IMDB + imdbId;
      const newMovie = {
        title,
        description,
        imgUrl,
        imdbId,
        imdbUrl,
      };
      setMovie(newMovie);
      setError(false);
      setDuplicate(false);
    } else {
      setError(true);
    }
  };

  const addMovieToList = () => {
    if (movie) {
      const duplicate = movies.some(film => film.imdbId === movie.imdbId);
      setDuplicate(duplicate);
    }
    if (!duplicate && movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    } 
  };

  const handleFocus = () => {
    setError(false);
    setDuplicate(false);
  };

  return(
    <>
    <form className="find-movie" onSubmit={handleSearch}>
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
            <input
              type="text"
              id="movie-title"
              onChange={handleChange}
              onFocus={handleFocus}
              value={query}
              placeholder="Enter a title to search"
              className={error ? 'input is-danger' : 'input'}
            />
          </div>
          {error && (
            <p className="help is-danger">
               Can&apos;t find a movie with such a title
            </p>
          )}
          {duplicate && (
            <p className="help is-danger">
               Movie already exists
            </p>
          )}  
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
            onClick={addMovieToList}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <p>{movie?.title}</p>
        {movie && <MovieCard {...movie} />}
      </div>
  </>
  );
}

