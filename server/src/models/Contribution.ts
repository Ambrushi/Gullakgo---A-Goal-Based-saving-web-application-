import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface ContributionAttributes {
  id: string;
  goalId: string;
  userId: string;
  amount: number;
  note: string;
  date: string;
}

export interface ContributionCreationAttributes extends Optional<ContributionAttributes, 'id' | 'note' | 'date'> {}

export class Contribution extends Model<ContributionAttributes, ContributionCreationAttributes> implements ContributionAttributes {
  public id!: string;
  public goalId!: string;
  public userId!: string;
  public amount!: number;
  public note!: string;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contribution.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'c_' + Date.now()
    },
    goalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      defaultValue: 'Daily Streak Contribution 🔥'
    },
    date: {
      type: DataTypes.STRING,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    sequelize,
    tableName: 'contributions',
    timestamps: true
  }
);
