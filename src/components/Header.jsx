import React from 'react';
import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

const Header = ({ 
  onSearch, 
  onShowAllPlayers, 
  onFilterByTeam, 
  onShowFavorites, 
  favoritesCount, 
  showingFavorites,
  onShowAddPlayerForm 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  // Cargar equipos al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await dataService.getAllTeams();
        setTeams(response.data);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setSelectedTeam('');
    onShowAllPlayers();
  };

  const handleTeamFilter = (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    
    if (teamId === '') {
      onShowAllPlayers();
    } else {
      onFilterByTeam(parseInt(teamId));
    }
  };

  return (
    <header className="bg-gradient-to-r from-transfermarket-green to-transfermarket-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-white text-2xl font-bold font-football cursor-pointer hover:text-goal-yellow transition-colors"
                onClick={handleShowAll}
              >
                ⚽ TransferMarket Pro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botón para agregar jugador */}
            <button
              onClick={onShowAddPlayerForm}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              title="Agregar nuevo jugador"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Agregar Jugador</span>
              <span className="sm:hidden">+</span>
            </button>

            {/* Botón de favoritos */}
            <button
              onClick={onShowFavorites}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                showingFavorites 
                  ? 'bg-goal-yellow text-referee-black' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Ver jugadores favoritos"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="hidden sm:inline">Favoritos</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Filtro por equipo */}
            <div className="relative">
              <select
                value={selectedTeam}
                onChange={handleTeamFilter}
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-goal-yellow focus:border-transparent appearance-none min-w-[150px]"
                disabled={showingFavorites}
              >
                <option value="" className="bg-gray-800 text-white">
                  Todos los equipos
                </option>
                {teams.map((team) => (
                  <option 
                    key={team.id} 
                    value={team.id}
                    className="bg-gray-800 text-white"
                  >
                    {team.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar jugadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-goal-yellow focus:border-transparent"
                  disabled={showingFavorites}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  disabled={showingFavorites}
                >
                  🔍
                </button>
              </div>
            </form>
            
            <button
              onClick={handleShowAll}
              className="bg-goal-yellow text-referee-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Ver Todos
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;