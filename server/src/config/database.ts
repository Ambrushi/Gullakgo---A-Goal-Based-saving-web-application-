import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres.vqjhhhxrxwgamowlruuz:Doomsday-18-12@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres';

export const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize PostgreSQL database connection established successfully.');
  } catch (error: any) {
    console.error('❌ Could not connect to Supabase PostgreSQL via Sequelize:', error.message || error);
  }
};
