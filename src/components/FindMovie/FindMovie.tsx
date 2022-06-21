import { useState } from 'react';
import { Form } from '../api/Form/Form';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

interface Props {
  callbackForMovies: (arg0 : Movie[]) => void;
  moviesPrev: Movie[];
}

export const FindMovie: React.FC<Props> = (
  { callbackForMovies, moviesPrev },
) => {
  const [preview, setPreview] = useState<Movie | null>(null);

  return (
    <>
      <Form
        callbackForMovies={callbackForMovies}
        prevMovies={moviesPrev}
        setPrev={setPreview}
        prev={preview}
      />
      <div className="container">
        <h2 className="title">Preview</h2>
        { preview
        && <MovieCard movie={preview} />}
      </div>
    </>
  );
};
