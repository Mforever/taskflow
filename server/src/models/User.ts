import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Интерфейс для методов экземпляра
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Интерфейс для документа
export interface IUser extends Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
  };
}

const userSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
      minlength: [2, 'Имя должно быть минимум 2 символа']
    },
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      minlength: [6, 'Пароль должен быть минимум 6 символов']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
      }
    }
  },
  {
    timestamps: true
  }
);

// Хеширование пароля
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод сравнения паролей
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>('User', userSchema);
export default User;