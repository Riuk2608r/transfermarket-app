import React from 'react';
import PlayerCard from './PlayerCard';

const PlayersList = ({ players, onPlayerClick, loading, error, favorites, onToggleFavorite }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-transfermarket-green mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando jugadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron jugadores</h2>
          <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {players.length} jugador{players.length !== 1 ? 'es' : ''} encontrado{players.length !== 1 ? 's' : ''}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={onPlayerClick}
            isFavorite={favorites ? favorites.includes(player.id) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayersList;