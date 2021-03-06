const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("./config_sequelize");
const { Temporada } = require("./temporadas");


const Corrida = sequelize.define('Corrida', {
    id: {
        type: DataTypes.STRING(7),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    urlWiki: Sequelize.STRING(200),
    nomeCircuito: Sequelize.STRING(100),
    dataCorrida: DataTypes.DATE
}, {
    tableName: 'Corridas',
    timestamps: false
})

Corrida.belongsTo(Temporada, { foreignKey: 'idTemporada' })

module.exports = { Corrida }
