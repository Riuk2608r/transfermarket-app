import React from 'react';
import dataService from '../services/dataService';

const PlayerCard = ({ player, onClick, isFavorite, onToggleFavorite }) => {
  const team = dataService.getTeam(player.teamId);
  const teamName = team?.name || 'Sin equipo';
  const teamLogo = team?.logo;
  const marketValue = dataService.formatMarketValue(player.marketValue);

  const getPositionColor = (position) => {
    switch (position.toLowerCase()) {
      case 'delantero':
        return 'bg-transfermarket-red text-white';
      case 'centrocampista':
        return 'bg-transfermarket-green text-white';
      case 'extremo':
        return 'bg-transfermarket-orange text-white';
      case 'defensa central':
        return 'bg-transfermarket-blue text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getMarketValueColor = (value) => {
    if (value >= 100000000) return 'text-transfermarket-red font-bold';
    if (value >= 50000000) return 'text-transfermarket-orange font-semibold';
    return 'text-transfermarket-green font-medium';
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que se active el onClick del card
    onToggleFavorite(player.id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100 relative"
      onClick={() => onClick(player)}
    >
      {/* Botón de favorito */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
          isFavorite 
            ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
            : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-yellow-500'
        }`}
        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <svg 
          className="w-5 h-5" 
          fill={isFavorite ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
          />
        </svg>
      </button>

      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {player.photo ? (
              <img 
                src={player.photo} 
                alt={player.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-16 h-16 bg-gradient-to-br from-transfermarket-blue to-transfermarket-green rounded-full flex items-center justify-center text-white font-bold text-xl ${player.photo ? 'hidden' : ''}`}
            >
              {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {player.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                {player.position}
              </span>
            </div>
            
            <div className="mt-1 flex items-center space-x-2">
              {teamLogo && (
                <img 
                  src={teamLogo} 
                  alt={teamName}
                  className="w-4 h-4 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <span className="text-sm text-gray-600">{teamName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{player.age} años</span>
            </div>
            
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-sm text-gray-500">🏳️ {player.nationality}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Goles</div>
            <div className="font-semibold text-transfermarket-green">{player.goals}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Asistencias</div>
            <div className="font-semibold text-transfermarket-blue">{player.assists}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Partidos</div>
            <div className="font-semibold text-gray-700">{player.matches}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Valor de mercado</span>
            <span className={`text-lg font-bold ${getMarketValueColor(player.marketValue)}`}>
              {marketValue}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-500">Contrato hasta</span>
            <span className="text-sm font-medium text-gray-700">{player.contractUntil}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;