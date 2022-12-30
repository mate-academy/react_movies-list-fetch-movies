import { FC, ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/MovieCard';

type Props = {
  movies: Movie[];
  handleMovieSet: (value: Movie) => void;
};

export const FindMovie: FC<Props> = (
  {
    movies,
    handleMovieSet,
  },
) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [isFindMovie, setFindMovie] = useState(false);
  const [isError, setError] = useState(false);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitle(event.target.value);
    setError(false);
  };

  const handleGetMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await getMovie(title);

    if ('Error' in data) {
      setError(true);
    } else {
      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });

      setFindMovie(true);
    }
  };

  const addMovie = () => {
    if (!movie) {
      return;
    }

    const presentMovie = movies.find(item => item.title === movie.title);

    if (!presentMovie) {
      handleMovieSet(movie);
    }

    setMovie(null);
    setTitle('');
    setFindMovie(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleGetMovie}>
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
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={title}
              onChange={onInputChange}

            />
          </div>

          {isError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              disabled={title.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {isFindMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
