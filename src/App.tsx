import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
// import { loadData } from './api/api';

// interface State {
//   movies: Movie[];
// }

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] >([]);

  const addToMovies = (newMovie: Movie) => {
    if (!movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addToMovies} />
      </div>
    </div>
  );
};

// export class App extends Component<{}, State> {
//   state: State = {
//     movies: [],
//   };

//   render() {
//     const { movies } = this.state;

//     return (
//       <div className="page">
//         <div className="page-content">
//           <MoviesList movies={movies} />
//         </div>
//         <div className="sidebar">
//           <FindMovie />
//         </div>
//       </div>
//     );
//   }
// }
