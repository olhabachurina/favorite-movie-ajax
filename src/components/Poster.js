import React from 'react';

function Poster({ poster }) {
  return (
    <div>
      {poster && poster !== 'N/A' ? (
        <img src={poster} alt="Постер фильма" style={{ width: '300px', borderRadius: '10px' }} />
      ) : (
        <p>Постер недоступен</p>
      )}
    </div>
  );
}

export default Poster;