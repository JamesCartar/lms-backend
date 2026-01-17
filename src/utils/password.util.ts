import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashedPassword = (rawPassword: string, salt = SALT_ROUNDS) => {
	return bcrypt.hash(rawPassword, salt);
};
