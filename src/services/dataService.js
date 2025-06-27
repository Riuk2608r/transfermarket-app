import axios from 'axios';
import playersData from '../data/playersData.json';

class DataService {
  constructor() {
    this.data = playersData;
    this.nextPlayerId = Math.max(...this.data.players.map(p => p.id)) + 1;
  }

  async getAllPlayers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: this.data.players,
        status: 200
      };
    } catch (error) {
      throw new Error('Error fetching players: ' + error.message);
    }
  }

  async getPlayerById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const player = this.data.players.find(p => p.id === parseInt(id));
      if (!player) {
        throw new Error('Player not found');
      }
      return {
        data: player,
        status: 200
      };
    } catch (error) {
      throw new Error('Error fetching player: ' + error.message);
    }
  }

  async getAllTeams() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        data: this.data.teams,
        status: 200
      };
    } catch (error) {
      throw new Error('Error fetching teams: ' + error.message);
    }
  }

  async getTeamById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const team = this.data.teams.find(t => t.id === parseInt(id));
      if (!team) {
        throw new Error('Team not found');
      }
      return {
        data: team,
        status: 200
      };
    } catch (error) {
      throw new Error('Error fetching team: ' + error.message);
    }
  }

  async getPlayersByTeam(teamId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const players = this.data.players.filter(p => p.teamId === parseInt(teamId));
      return {
        data: players,
        status: 200
      };
    } catch (error) {
      throw new Error('Error fetching team players: ' + error.message);
    }
  }

  async searchPlayers(query) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const searchTerm = query.toLowerCase();
      const filteredPlayers = this.data.players.filter(player => 
        player.name.toLowerCase().includes(searchTerm) ||
        player.position.toLowerCase().includes(searchTerm) ||
        player.nationality.toLowerCase().includes(searchTerm)
      );
      return {
        data: filteredPlayers,
        status: 200
      };
    } catch (error) {
      throw new Error('Error searching players: ' + error.message);
    }
  }

  async addPlayer(playerData) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear nuevo jugador con ID único
      const newPlayer = {
        id: this.nextPlayerId,
        name: playerData.name,
        age: playerData.age,
        position: playerData.position,
        nationality: playerData.nationality,
        teamId: playerData.teamId,
        marketValue: playerData.marketValue,
        contractUntil: playerData.contractUntil || null,
        shirtNumber: playerData.shirtNumber || null,
        height: playerData.height || null,
        weight: playerData.weight || null,
        foot: playerData.foot || 'right',
        image: '/api/placeholder/150/150', // Placeholder para imagen
        dateAdded: new Date().toISOString()
      };

      // Agregar al array de jugadores
      this.data.players.push(newPlayer);
      
      // Incrementar ID para el siguiente jugador
      this.nextPlayerId++;

      return {
        data: newPlayer,
        status: 201,
        message: 'Jugador agregado exitosamente'
      };
    } catch (error) {
      throw new Error('Error adding player: ' + error.message);
    }
  }

  // Método para validar si un número de camiseta está disponible en un equipo
  async validateShirtNumber(teamId, shirtNumber, excludePlayerId = null) {
    try {
      const teamPlayers = this.data.players.filter(p => 
        p.teamId === parseInt(teamId) && 
        p.shirtNumber === parseInt(shirtNumber) &&
        (excludePlayerId ? p.id !== excludePlayerId : true)
      );
      
      return {
        data: { available: teamPlayers.length === 0 },
        status: 200
      };
    } catch (error) {
      throw new Error('Error validating shirt number: ' + error.message);
    }
  }

  getTeamName(teamId) {
    const team = this.data.teams.find(t => t.id === teamId);
    return team ? team.name : 'Equipo Desconocido';
  }

  getTeam(teamId) {
    return this.data.teams.find(t => t.id === teamId);
  }

  formatMarketValue(value) {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  }

  // Método para obtener estadísticas del jugador recién agregado
  getPlayerStats() {
    return {
      totalPlayers: this.data.players.length,
      lastAddedPlayer: this.data.players[this.data.players.length - 1],
      averageAge: Math.round(this.data.players.reduce((sum, p) => sum + p.age, 0) / this.data.players.length),
      totalMarketValue: this.data.players.reduce((sum, p) => sum + p.marketValue, 0)
    };
  }
}

export default new DataService();