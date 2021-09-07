const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./config_sequelize')

// driverId: 'arnoux',
// url: 'http://en.wikipedia.org/wiki/Ren%C3%A9_Arnoux',
// givenName: 'René',
// familyName: 'Arnoux',
// dateOfBirth: '1948-07-04',
// nationality: 'French'

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
    type: Sequelize.STRING(100)
  },
  sobrenome: {
    type: Sequelize.STRING(100)
  },
  dataNascimento: {
    type: DataTypes.DATE
  },
  nacionalidade: {
    type: Sequelize.STRING(30)
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
  timestamps: false
})

module.exports = { Piloto }
