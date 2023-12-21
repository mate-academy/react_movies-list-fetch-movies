import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MoviesProvider } from './providers/MovieProvider';

export const App = () => {
  // const [movies] = useState<Movie[]>([]);

  return (
    <MoviesProvider>
      <div className="page">
        <div className="page-content">
          <MoviesList />
        </div>

        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    </MoviesProvider>
  );
};
