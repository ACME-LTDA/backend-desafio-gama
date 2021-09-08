const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('./config_sequelize')
const { Construtor } = require('./construtores')
const { Corrida } = require('./corridas')
const { Piloto } = require('./pilotos')
const { Temporada } = require('./temporadas')

const Resultado = sequelize.define('Resultado', {
  id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  numeroCarro: DataTypes.TINYINT,
  posLargada: DataTypes.TINYINT,
  posChegada: DataTypes.TINYINT,
  voltas: DataTypes.SMALLINT,
  status: DataTypes.STRING(100)
}, {
  tableName: 'Resultados',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})

Resultado.belongsTo(Temporada, { foreignKey: 'idTemporada', allowNull: false })
Resultado.belongsTo(Piloto, { foreignKey: 'idPiloto', allowNull: false })
Resultado.belongsTo(Construtor, { foreignKey: 'idConstrutor', allowNull: false })
Resultado.belongsTo(Corrida, { foreignKey: 'idCorrida', allowNull: false })

module.exports = { Resultado }
