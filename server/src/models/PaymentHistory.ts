import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface PaymentHistoryAttributes {
  id: string;
  userId: string;
  utr: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  app: string;
  date: string;
}

export interface PaymentHistoryCreationAttributes extends Optional<PaymentHistoryAttributes, 'id' | 'description' | 'status' | 'app' | 'date'> {}

export class PaymentHistory extends Model<PaymentHistoryAttributes, PaymentHistoryCreationAttributes> implements PaymentHistoryAttributes {
  public id!: string;
  public userId!: string;
  public utr!: string;
  public type!: string;
  public description!: string;
  public amount!: number;
  public status!: string;
  public app!: string;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PaymentHistory.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'tx_' + Date.now()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    utr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 'Payment Deposit'
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'SUCCESS'
    },
    app: {
      type: DataTypes.STRING,
      defaultValue: 'UPI'
    },
    date: {
      type: DataTypes.STRING,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    sequelize,
    tableName: 'payment_history',
    timestamps: true
  }
);
