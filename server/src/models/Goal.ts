import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface GoalAttributes {
  id: string;
  userId: string;
  title: string;
  category: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  dailySavingRate: number;
  streak: number;
  lockIn: boolean;
  status: 'active' | 'completed' | 'paused';
}

export interface GoalCreationAttributes extends Optional<GoalAttributes, 'id' | 'icon' | 'currentAmount' | 'dailySavingRate' | 'streak' | 'lockIn' | 'status'> {}

export class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public category!: string;
  public icon!: string;
  public targetAmount!: number;
  public currentAmount!: number;
  public targetDate!: string;
  public dailySavingRate!: number;
  public streak!: number;
  public lockIn!: boolean;
  public status!: 'active' | 'completed' | 'paused';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Goal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'g_' + Date.now()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'bi-piggy-bank'
    },
    targetAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    currentAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    targetDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dailySavingRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    lockIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'paused'),
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    tableName: 'goals',
    timestamps: true
  }
);
