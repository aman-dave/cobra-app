const Sequelize = require('sequelize')
const db = require('../config/database')

module.exports = db.define(
  'metabolite',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'name',
    },
    sbmlId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'sbml_id',
    },
    formula: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'formula',
    },
    modelId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'models',
        key: 'id',
      },
      field: 'model_id',
    },
  },
  {
    tableName: 'metabolites',
  }
)
