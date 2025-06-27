import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PlayersList from './components/PlayersList';
import PlayerProfile from './components/PlayerProfile';
import LoadingSpinner from './components/LoadingSpinner';
import dataService from './services/dataService';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showingFavorites, setShowingFavorites] = useState(false);

  useEffect(() => {
    loadAllPlayers();
    loadFavorites();
  }, []);

  // Cargar favoritos desde localStorage
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('playerFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  // Guardar favoritos en localStorage
  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('playerFavorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  };

  const loadAllPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataService.getAllPlayers();
      setPlayers(response.data);
      setSearchQuery('');
      setShowingFavorites(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      setShowingFavorites(false);
      const response = await dataService.searchPlayers(query);
      setPlayers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByTeam = async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      setShowingFavorites(false);
      const response = await dataService.getPlayersByTeam(teamId);
      setPlayers(response.data);
      setSearchQuery('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (playerId) => {
    const newFavorites = favorites.includes(playerId)
      ? favorites.filter(id => id !== playerId)
      : [...favorites, playerId];
    
    saveFavorites(newFavorites);
  };

  const handleShowFavorites = async () => {
    if (favorites.length === 0) {
      alert('No tienes jugadores favoritos guardados');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchQuery('');
      setShowingFavorites(true);
      
      // Obtener todos los jugadores y filtrar solo los favoritos
      const response = await dataService.getAllPlayers();
      const favoritePlayers = response.data.filter(player => 
        favorites.includes(player.id)
      );
      
      setPlayers(favoritePlayers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleCloseProfile = () => {
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        onShowAllPlayers={loadAllPlayers}
        onFilterByTeam={handleFilterByTeam}
        onShowFavorites={handleShowFavorites}
        favoritesCount={favorites.length}
        showingFavorites={showingFavorites}
      />
      
      <main>
        {searchQuery && (
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-gray-600">
                Resultados para: <span className="font-semibold text-transfermarket-green">"{searchQuery}"</span>
              </p>
            </div>
          </div>
        )}

        {showingFavorites && (
          <div className="bg-yellow-50 border-b border-yellow-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-yellow-800 font-medium">
                  Mostrando {players.length} jugador{players.length !== 1 ? 'es' : ''} favorito{players.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <PlayersList
          players={players}
          onPlayerClick={handlePlayerClick}
          loading={loading}
          error={error}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
}

export default App;