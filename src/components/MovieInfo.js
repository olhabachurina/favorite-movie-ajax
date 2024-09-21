import React from 'react';

function MovieInfo({ title, director, releaseYear, studio }) {
  return (
    <div>
      <h2>{title}</h2>
      <p><strong>Режиссёр:</strong> {director}</p>
      <p><strong>Год выпуска:</strong> {releaseYear}</p>
      <p><strong>Киностудия:</strong> {studio || 'Информация отсутствует'}</p>
    </div>
  );
}

export default MovieInfo;