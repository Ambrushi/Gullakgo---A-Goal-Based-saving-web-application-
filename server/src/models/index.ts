import { sequelize } from '../config/database.js';
import { Profile } from './Profile.js';
import { Goal } from './Goal.js';
import { Contribution } from './Contribution.js';
import { Expense } from './Expense.js';
import { PaymentHistory } from './PaymentHistory.js';
import { Subscription } from './Subscription.js';

// Define Associations
Profile.hasMany(Goal, { foreignKey: 'userId', as: 'goals' });
Goal.belongsTo(Profile, { foreignKey: 'userId', as: 'user' });

Goal.hasMany(Contribution, { foreignKey: 'goalId', as: 'contributions' });
Contribution.belongsTo(Goal, { foreignKey: 'goalId', as: 'goal' });

Profile.hasMany(Contribution, { foreignKey: 'userId', as: 'contributions' });
Contribution.belongsTo(Profile, { foreignKey: 'userId', as: 'user' });

Profile.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(Profile, { foreignKey: 'userId', as: 'user' });

Profile.hasMany(PaymentHistory, { foreignKey: 'userId', as: 'payments' });
PaymentHistory.belongsTo(Profile, { foreignKey: 'userId', as: 'user' });

Profile.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
Subscription.belongsTo(Profile, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  Profile,
  Goal,
  Contribution,
  Expense,
  PaymentHistory,
  Subscription
};

export const syncDatabase = async () => {
  try {
    // Automatically creates/modifies tables in PostgreSQL database
    await sequelize.sync({ alter: true });
    console.log('🔄 Sequelize models synchronized & auto-created in Supabase PostgreSQL successfully!');
  } catch (error: any) {
    console.error('❌ Database auto-sync error:', error.message || error);
  }
};
