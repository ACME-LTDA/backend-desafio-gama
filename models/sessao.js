const { DataTypes } = require("sequelize");
const { sequelize } = require("./config_sequelize");
const { Usuario } = require("./usuarios");

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.STRING(36),
    unique: true,
    allowNull: false,
    primaryKey: true
  },
  dataExpiracao: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'RefreshTokens',
  timestamps: false,
})

RefreshToken.belongsTo(Usuario, { foreignKey: 'idUsuario', allowNull: false })

module.exports = { RefreshToken }
