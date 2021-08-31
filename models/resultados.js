const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('./config_sequelize')
const { Construtor } = require('./construtores')
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
    timestamps: false
})

Resultado.belongsTo(Temporada, { foreignKey: 'idTemporada' })
Resultado.belongsTo(Piloto, { foreignKey: 'idPiloto' })
Resultado.belongsTo(Construtor, { foreignKey: 'idConstrutor' })

module.exports = { Resultado }
