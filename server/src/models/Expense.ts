import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface ExpenseAttributes {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  icon: string;
  date: string;
}

export interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'icon' | 'date'> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public amount!: number;
  public category!: string;
  public icon!: string;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'e_' + Date.now()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'bi-receipt'
    },
    date: {
      type: DataTypes.STRING,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    sequelize,
    tableName: 'expenses',
    timestamps: true
  }
);
