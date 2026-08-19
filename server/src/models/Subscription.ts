import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface SubscriptionAttributes {
  id: string;
  userId: string;
  planId: string;
  expiryDate?: string | null;
  dailyUsageCount: number;
  lastResetDate: string;
}

export interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id' | 'planId' | 'expiryDate' | 'dailyUsageCount' | 'lastResetDate'> {}

export class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
  public id!: string;
  public userId!: string;
  public planId!: string;
  public expiryDate!: string | null;
  public dailyUsageCount!: number;
  public lastResetDate!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'sub_' + Date.now()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    planId: {
      type: DataTypes.STRING,
      defaultValue: 'free'
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dailyUsageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastResetDate: {
      type: DataTypes.STRING,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    sequelize,
    tableName: 'subscriptions',
    timestamps: true
  }
);
