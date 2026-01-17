import { getModelForClass, index, prop } from '@typegoose/typegoose';

/**
 * OTP target type
 * * Determines which user domain this OTP belongs to
 */
export enum OtpTargetType {
	ADMIN = 'admin',
	STUDENT = 'student',
}

/**
 * OTP Model
 * * Stores short-lived OTPs for verification (e.g. forgot password)
 * ! TTL index automatically deletes records after 5 minutes
 */
@index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export class Otp {
	@prop({
		required: true,
		lowercase: true,
		trim: true,
	})
	public email!: string;

	@prop({
		required: true,
		enum: OtpTargetType,
	})
	public type!: OtpTargetType;

	@prop({ required: true })
	public otp!: string;

	@prop({ default: false })
	public verified?: boolean;

	@prop({
		required: true,
		default: () => new Date(Date.now() + 5 * 60 * 1000),
	})
	public expiresAt!: Date;

	@prop({ default: Date.now })
	public createdAt?: Date;
}

// Get the Mongoose model
export const OtpModel = getModelForClass(Otp);
