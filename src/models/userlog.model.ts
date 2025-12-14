import { prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';

/**
 * UserLog Model - Tracks user login activity
 * Records login time, IP address, and browser agent
 */
export class UserLog {
  @prop({ required: true, ref: () => 'User' })
  public userId!: Types.ObjectId;

  @prop({ required: true })
  public userType!: 'admin' | 'student';

  @prop({ required: true })
  public email!: string;

  @prop({ trim: true })
  public ip?: string;

  @prop({ trim: true })
  public userAgent?: string;

  @prop({ default: Date.now })
  public loginTime!: Date;
}

// Get the Mongoose model
export const UserLogModel = getModelForClass(UserLog, {
  schemaOptions: {
    collection: 'userlogs',
    timestamps: false,
  },
});
