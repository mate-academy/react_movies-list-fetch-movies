import {
  useState,
  ChangeEvent,
  FC,
  useCallback,
} from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  const [title, setTitle] = useState('');
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isTitleCorrect, setIsTitleCorrect] = useState(true);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsTitleCorrect(true);
  };

  const loadMovie = async () => {
    try {
      setIsMovieLoading(true);

      const loadedMovie = await getMovie(title);

      if (loadedMovie.Response === 'True') {
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
      }

      if (loadedMovie.Response === 'False') {
        setIsTitleCorrect(false);
      }
    } finally {
      setIsMovieLoading(false);
    }
  };

  const handleTtitleSubmit = (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    loadMovie();
  };

  const handleAddMovie = useCallback(() => {
    const isNewMovie = !movies
      .find(addedMovie => addedMovie.title === movie?.title);

    if (movie && isNewMovie) {
      setMovies(state => (
        [
          ...state,
          movie,
        ]
      ));
    }

    setMovie(null);
    setTitle('');
  }, [movie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleTtitleSubmit={handleTtitleSubmit}
          title={title}
          handleTitleChange={handleTitleChange}
          isTitleCorrect={isTitleCorrect}
          movie={movie}
          isMovieLoading={isMovieLoading}
          handleAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
