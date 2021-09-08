const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./config_sequelize')

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  nome: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  sobrenome: {
    type: Sequelize.STRING(200),
  },
  hashSenha: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  salt: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  administrador: {
    type: Sequelize.STRING(1),
    allowNull: false,
    // T para True, F para False
    validate: {
      is: /^[TF]/i
    }
  },
  nomeImagemAvatar: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  }

}, {
  tableName: 'Usuarios',
  timestamps: false
})

module.exports = { Usuario }
