const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./config_sequelize')

const Piloto = sequelize.define('Piloto', {
  id: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  urlWiki: {
    type: Sequelize.STRING(200)
  },
  primeiroNome: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  sobrenome: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  nacionalidade: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  observacao: {
    type: Sequelize.STRING(1000)
  },
  nomeCompleto: {
    type: DataTypes.VIRTUAL(DataTypes.STRING(200),
      ['primeiroNome', 'sobrenome']),
    get() {
      return this.getDataValue('primeiroNome') + ' ' + this.getDataValue('sobrenome');
    },
    set(value) {
      throw new Error('Do not try to set the "nomeCompleto" value!');
    }
  }
}, {
  tableName: 'Pilotos',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})

module.exports = { Piloto }
