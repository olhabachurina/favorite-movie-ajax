import React, { useState, useEffect } from 'react';

function MovieSearch() {
  const [movieTitle, setMovieTitle] = useState('');
  const [minRating, setMinRating] = useState('');
  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [newMovieAnimation, setNewMovieAnimation] = useState({}); // Новое состояние для анимации

  const isFavorite = (movie) => favoriteMovies.some((fav) => fav.Title === movie.Title);

  const addToFavorites = () => {
    console.log('Adding movie to favorites:', movie.Title);
    if (!isFavorite(movie)) {
      setFavoriteMovies([...favoriteMovies, movie]);
      // Задаем анимацию для нового фильма
      setNewMovieAnimation((prevState) => ({
        ...prevState,
        [movie.Title]: true,
      }));
    }
  };

  const removeFromFavorites = (movieToRemove) => {
    console.log('Removing movie from favorites:', movieToRemove.Title);
    setFavoriteMovies(favoriteMovies.filter((fav) => fav.Title !== movieToRemove.Title));
  };

  const onSearchMovie = (event) => {
    event.preventDefault();

    if (movieTitle.length < 2 || minRating < 0 || minRating > 10) {
      setErrorMessage('Введите корректные данные.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    console.log('Searching for movie:', movieTitle);

    fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=5e96da99`)
    .then((response) => response.json())
      .then((data) => {
        console.log('OMDb API response:', data);
        if (data.Response === 'True') {
          setMovie(data);
          setLoading(false);
        } else {
          setErrorMessage('Фильм не найден');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setErrorMessage('Ошибка запроса');
        setLoading(false);
      });
  };

  return (
    <div className="movie-search-container">
      <h1>Movie Search</h1>

      <form onSubmit={onSearchMovie}>
        <input 
          type="text" 
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Enter movie title" 
          required
          minLength={2}
        />

        <input 
          type="number"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          placeholder="Enter minimum rating (0-10)"
          min="0"
          max="10"
          required
        />

        <button type="submit" disabled={movieTitle.length < 2 || minRating < 0 || minRating > 10}>
          Search
        </button>
      </form>

      {loading && <div className="loading-spinner">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {movie && !errorMessage && (
        <div className="movie-info">
          <h2>{movie.Title} ({movie.Year})</h2>
          <p><strong>Rating:</strong> {movie.imdbRating}</p>
          <p><strong>Duration:</strong> {movie.Runtime}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Description:</strong> {movie.Plot}</p>

          <div className="tv-frame">
            <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', borderRadius: '10px' }} />
          </div>

          {!isFavorite(movie) ? (
            <button className="favorite-btn" onClick={addToFavorites}>
              Add to Favorites
            </button>
          ) : (
            <button className="favorite-btn remove" onClick={() => removeFromFavorites(movie)}>
              Remove from Favorites
            </button>
          )}
        </div>
      )}

      {favoriteMovies.length > 0 && (
        <div className="favorites-list">
          <h3>Your Favorite Movies</h3>
          <ul className="favorites-list-ul">
            {favoriteMovies.map((fav) => (
              <li 
                key={fav.Title} 
                className={`favorite-movie ${newMovieAnimation[fav.Title] ? 'slide-in' : ''}`}
                onAnimationEnd={() => {
                  // Отключаем анимацию после ее завершения
                  setNewMovieAnimation((prevState) => ({
                    ...prevState,
                    [fav.Title]: false,
                  }));
                }}
              >
                <div className="favorite-movie-content">
                  <img src={fav.Poster} alt={fav.Title} style={{ width: '80px', borderRadius: '5px' }} />
                  <h4>{fav.Title} ({fav.Year})</h4>
                </div>
                <button className="favorite-btn remove" onClick={() => removeFromFavorites(fav)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;