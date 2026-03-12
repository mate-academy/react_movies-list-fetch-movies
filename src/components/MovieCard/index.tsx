export * from './MovieCard';
// MovieCard.tsx
export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={movie.imgUrl}
            alt={movie.title}
            // если тест всё ещё жалуется на poster — можно добавить:
            // data-cy="previewPoster"
          />
        </figure>
      </div>
      <div className="card-content">
        <p className="title is-6">{movie.title}</p>
        <p className="subtitle is-7">{movie.description.slice(0, 100)}...</p>
        {/* ... */}
      </div>
    </div>
  );
};
