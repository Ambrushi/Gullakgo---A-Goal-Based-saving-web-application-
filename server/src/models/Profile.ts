import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface ProfileAttributes {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  handle?: string;
  avatar?: string;
  level?: string;
  totalSaved: number;
  globalStreak: number;
  parentLinked: boolean;
  parentName?: string;
  parentEmail?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
}

export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id' | 'email' | 'password' | 'handle' | 'avatar' | 'level' | 'totalSaved' | 'globalStreak' | 'parentLinked' | 'parentName' | 'parentEmail' | 'upiId' | 'bankName' | 'accountNumber' | 'ifscCode' | 'accountHolder'> {}

export class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: string;
  public name!: string;
  public mobile!: string;
  public email!: string;
  public password!: string;
  public handle!: string;
  public avatar!: string;
  public level!: string;
  public totalSaved!: number;
  public globalStreak!: number;
  public parentLinked!: boolean;
  public parentName!: string;
  public parentEmail!: string;
  public upiId!: string;
  public bankName!: string;
  public accountNumber!: string;
  public ifscCode!: string;
  public accountHolder!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Profile.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => 'usr_' + Date.now()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '⚡'
    },
    level: {
      type: DataTypes.STRING,
      defaultValue: 'Rookie Saver 🌟'
    },
    totalSaved: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    globalStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    parentLinked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    parentName: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    parentEmail: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    upiId: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    bankName: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    accountNumber: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    ifscCode: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    accountHolder: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  },
  {
    sequelize,
    tableName: 'profiles',
    timestamps: true
  }
);
