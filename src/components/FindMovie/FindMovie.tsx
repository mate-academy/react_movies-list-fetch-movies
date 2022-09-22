import { FC, useState, ChangeEvent } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/MovieCard';

type Props = {
  movies: Movie[]
  handleMovieSet: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ handleMovieSet, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [isSearching, setSearched] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitle(event.target.value);
    setError(false);
  };

  const handleGetMovie = (event: React.MouseEvent<HTMLButtonElement,
  MouseEvent>) => {
    event.preventDefault();
    setSearched(true);

    return (title && getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setError(true);
        } else {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });

          setError(false);
        }
      })
      .finally(() => {
        setSearched(false);
      })
    );
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    const foundMovie = movies.find(current => current.title === movie.title);

    if (!foundMovie) {
      handleMovieSet(movie);
    }

    setMovie(null);
    setTitle('');
    setError(false);
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    handleMovieAdd();
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={
                classNames(
                  'input',
                  {
                    'is-danger': error && !movie,
                  },
                )
              }
              value={title}
              onChange={event => handleInputChange(event)}
            />
          </div>

          {error && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': isSearching },
              )}
              onClick={(event) => handleGetMovie(event)}
              disabled={title.length === 0}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie
              && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={event => handleSubmit(event)}
                >
                  Add to the list
                </button>
              )}
          </div>
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
