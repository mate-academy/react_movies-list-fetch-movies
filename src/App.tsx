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

  addMovie = (movie: Movie) => {
    const condition = this.state.movies.find(move => move.imdbID === movie.imdbID);

    if (condition) {
      return;
    }

    this.setState(Prev => ({ movies: [...Prev.movies, movie] }));
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
            add={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
