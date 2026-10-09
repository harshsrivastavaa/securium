const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Course extends Model {}

Course.init(
  {
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        len: [2, 120]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 1000]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
        max: 999999
      }
    },
    duration: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        len: [1, 80]
      }
    }
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'Courses'
  }
);

module.exports = Course;
