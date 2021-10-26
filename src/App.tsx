import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  addMovieToState = (movie: Movie) => {
    this.setState(({ movies }) => {
      const findDouble = movies.find(prevMovie => prevMovie.imdbID === movie.imdbID);

      if (!findDouble) {
        return { movies: [...movies, movie] };
      }

      return ({ movies });
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovieToState={this.addMovieToState}
          />
        </div>
      </div>
    );
  }
}
