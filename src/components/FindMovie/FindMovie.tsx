import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
interface Props {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [searchString, setSearchString] = useState('');
  const [wrongTitle, setWrongTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialMovieState: Movie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };
  const [movie, setMovie] = useState<Movie>(initialMovieState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
    setWrongTitle(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(searchString).then(fetchedMovie => {
      setIsLoading(false);
      if ('Error' in fetchedMovie || !('Title' in fetchedMovie)) {
        setWrongTitle(true);
      } else {
        const newMovie = {
          title: fetchedMovie.Title,
          description: fetchedMovie.Plot,
          imgUrl:
            fetchedMovie.Poster !== 'N/A'
              ? fetchedMovie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: 'https://www.imdb.com/title/' + fetchedMovie.imdbID,
          imdbId: fetchedMovie.imdbID,
        };

        setMovie(newMovie);
      }
    });
  };

  const handleAddMovie = () => {
    const check = movies.filter(movie1 => movie1.imdbId === movie.imdbId);

    if (check.length === 0) {
      setMovies([...movies, movie]);
    }

    setSearchString('');
    setMovie(initialMovieState);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${wrongTitle ? `is-danger` : ''} `}
              onChange={handleChange}
              value={searchString}
            />
          </div>

          {wrongTitle && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={searchString.length === 0}
            >
              Find a movie
            </button>
          </div>
          {movie.imdbId !== '' && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie.imdbId !== '' && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
