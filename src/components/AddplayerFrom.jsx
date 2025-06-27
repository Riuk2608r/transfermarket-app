import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

const AddPlayerForm = ({ isVisible, onClose, onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    position: '',
    nationality: '',
    teamId: '',
    marketValue: '',
    contractUntil: '',
    shirtNumber: '',
    height: '',
    weight: '',
    foot: 'right'
  });

  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positions = [
    'Portero',
    'Defensa Central',
    'Lateral Derecho',
    'Lateral Izquierdo',
    'Pivote',
    'Mediocentro',
    'Mediocentro Ofensivo',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero Centro',
    'Segundo Delantero'
  ];

  const countries = [
    'España', 'Francia', 'Inglaterra', 'Alemania', 'Italia', 'Portugal',
    'Brasil', 'Argentina', 'Holanda', 'Bélgica', 'Colombia', 'México',
    'Estados Unidos', 'Croacia', 'Polonia', 'Suecia', 'Noruega',
    'Dinamarca', 'Austria', 'Suiza', 'República Checa', 'Ucrania',
    'Serbia', 'Eslovaquia', 'Eslovenia', 'Bulgaria', 'Rumania',
    'Grecia', 'Turquía', 'Marruecos', 'Nigeria', 'Ghana', 'Senegal',
    'Costa de Marfil', 'Camerún', 'Túnez', 'Argelia', 'Egipto',
    'Sudáfrica', 'Japón', 'Corea del Sur', 'Australia', 'Chile',
    'Uruguay', 'Perú', 'Ecuador', 'Venezuela', 'Paraguay', 'Bolivia'
  ];

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

    if (isVisible) {
      fetchTeams();
    }
  }, [isVisible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.age || formData.age < 16 || formData.age > 45) {
      newErrors.age = 'La edad debe estar entre 16 y 45 años';
    }

    if (!formData.position) {
      newErrors.position = 'La posición es obligatoria';
    }

    if (!formData.nationality) {
      newErrors.nationality = 'La nacionalidad es obligatoria';
    }

    if (!formData.teamId) {
      newErrors.teamId = 'El equipo es obligatorio';
    }

    if (!formData.marketValue || formData.marketValue < 0) {
      newErrors.marketValue = 'El valor de mercado debe ser un número positivo';
    }

    if (formData.shirtNumber && (formData.shirtNumber < 1 || formData.shirtNumber > 99)) {
      newErrors.shirtNumber = 'El número de camiseta debe estar entre 1 y 99';
    }

    if (formData.height && (formData.height < 150 || formData.height > 220)) {
      newErrors.height = 'La altura debe estar entre 150 y 220 cm';
    }

    if (formData.weight && (formData.weight < 50 || formData.weight > 120)) {
      newErrors.weight = 'El peso debe estar entre 50 y 120 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos del jugador
      const playerData = {
        ...formData,
        age: parseInt(formData.age),
        teamId: parseInt(formData.teamId),
        marketValue: parseInt(formData.marketValue),
        shirtNumber: formData.shirtNumber ? parseInt(formData.shirtNumber) : null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null
      };

      // Agregar jugador usando el servicio
      const response = await dataService.addPlayer(playerData);
      
      // Notificar al componente padre
      onPlayerAdded(response.data);
      
      // Resetear formulario
      setFormData({
        name: '',
        age: '',
        position: '',
        nationality: '',
        teamId: '',
        marketValue: '',
        contractUntil: '',
        shirtNumber: '',
        height: '',
        weight: '',
        foot: 'right'
      });

      // Cerrar formulario
      onClose();

    } catch (error) {
      console.error('Error al agregar jugador:', error);
      setErrors({ submit: 'Error al agregar el jugador. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      age: '',
      position: '',
      nationality: '',
      teamId: '',
      marketValue: '',
      contractUntil: '',
      shirtNumber: '',
      height: '',
      weight: '',
      foot: 'right'
    });
    setErrors({});
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Jugador</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Lionel Messi"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Edad */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Edad *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="16"
                max="45"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 25"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            {/* Posición */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Posición *
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar posición</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>

            {/* Nacionalidad */}
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                Nacionalidad *
              </label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nationality ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar país</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
            </div>

            {/* Equipo */}
            <div>
              <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
                Equipo *
              </label>
              <select
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.teamId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar equipo</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.teamId && <p className="text-red-500 text-sm mt-1">{errors.teamId}</p>}
            </div>

            {/* Valor de Mercado */}
            <div>
              <label htmlFor="marketValue" className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Mercado (€) *
              </label>
              <input
                type="number"
                id="marketValue"
                name="marketValue"
                value={formData.marketValue}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.marketValue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 50000000"
              />
              {errors.marketValue && <p className="text-red-500 text-sm mt-1">{errors.marketValue}</p>}
            </div>

            {/* Número de Camiseta */}
            <div>
              <label htmlFor="shirtNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Camiseta
              </label>
              <input
                type="number"
                id="shirtNumber"
                name="shirtNumber"
                value={formData.shirtNumber}
                onChange={handleInputChange}
                min="1"
                max="99"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shirtNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 10"
              />
              {errors.shirtNumber && <p className="text-red-500 text-sm mt-1">{errors.shirtNumber}</p>}
            </div>

            {/* Contrato Hasta */}
            <div>
              <label htmlFor="contractUntil" className="block text-sm font-medium text-gray-700 mb-2">
                Contrato Hasta
              </label>
              <input
                type="date"
                id="contractUntil"
                name="contractUntil"
                value={formData.contractUntil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Altura */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="150"
                max="220"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 175"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            {/* Peso */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="50"
                max="120"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 70"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            {/* Pie Preferido */}
            <div>
              <label htmlFor="foot" className="block text-sm font-medium text-gray-700 mb-2">
                Pie Preferido
              </label>
              <select
                id="foot"
                name="foot"
                value={formData.foot}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="right">Derecho</option>
                <option value="left">Izquierdo</option>
                <option value="both">Ambos</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isSubmitting ? 'Agregando...' : 'Agregar Jugador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerForm;