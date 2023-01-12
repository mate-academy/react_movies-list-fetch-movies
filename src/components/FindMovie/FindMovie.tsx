import {
  ChangeEvent,
  FC,
  useState,
  useCallback,
} from 'react';

import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

import { getMovie } from '../../api';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [isTitleCorrect, setIsTitleCorrect] = useState(true);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsTitleCorrect(true);
  };

  const loadMovie = async () => {
    try {
      setIsMovieLoading(true);

      const loadedMovie = await getMovie(title);

      if (!loadedMovie.Error) {
        setIsTitleCorrect(true);

        const {
          Title,
          Poster,
          Plot,
          imdbID,
        } = loadedMovie;

        const imdbUrl = `https://www.imdb.com/title/${imdbID}`;

        const imgUrl = Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl,
          imdbUrl,
          imdbId: imdbID,
        });
      } else {
        setIsTitleCorrect(false);
      }
    } finally {
      setIsMovieLoading(false);
    }
  };

  const handleTitleSubmit = (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    loadMovie();
  };

  const handleAddMovie = useCallback(() => {
    if (movie) {
      addMovie(movie);
    }

    setTitle('');
    setMovie(null);
  }, [movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleTitleSubmit}
      >
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
              className="input is-dander"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {
            !isTitleCorrect
              && (
                <p className="help is-danger" data-cy="errorMessage">
                  Can&apos;t find a movie with such a title
                </p>
              )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isMovieLoading },
              )}
              disabled={!title}
            >
              {
                !movie
                  ? 'Find a movie'
                  : 'Search again'
              }
            </button>
          </div>

          {
            movie
              && (
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
              )
          }
        </div>
      </form>

      {
        movie
          && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>

              <MovieCard movie={movie} />
            </div>
          )
      }
    </>
  );
};
