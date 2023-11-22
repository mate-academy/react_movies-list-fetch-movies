import
React,
{
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  addMovie: Dispatch<SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isErorr, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsError(false);
    setTitle(e.target.value);
  }

  function findMovie(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);

    getMovie(title)
      .then((data) => {
        if ('Error' in data) {
          setNewMovie(null);
          setIsError(true);
        } else {
          const src = data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster;
          const movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: src,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
            imdbId: data.imdbID,
          };

          setNewMovie(movie);
          setIsError(false);
        }
      })
      .finally(() => setIsLoading(false));
  }

  function add(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    if (newMovie && !movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      addMovie((curr: Movie[]) => [...curr, newMovie]);
    }

    setTitle('');
    setNewMovie(null);
  }

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
              className={classNames('input', {
                'is-danger': isErorr,
              })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {isErorr && (
              'Cant find a movie with such a title'
            )}

          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={title.length === 0}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={add}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {!isErorr && newMovie && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
