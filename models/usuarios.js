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

}, {
    tableName: 'Usuarios',
    timestamps: false
})

module.exports= { Usuario }
