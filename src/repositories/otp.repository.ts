import { type Otp, OtpModel } from '../db/models/otp.model';

export class OtpRepository {
	async create(data: Partial<Otp>) {
		return await OtpModel.create(data);
	}

	// * verified မဖြစ်သေးတဲ့ ဟာကို ရှာ

	async findByEmail(email: string) {
		return await OtpModel.findOne({
			email,
			verified: false,
		});
	}

	// * verified မဖြစ်သေးတဲ့ ဟာကို ရှာ ပီး verified လုပ်
	async update(email: string, otp: string, data: Partial<Otp>) {
		return await OtpModel.findOneAndUpdate(
			{
				email,
				otp,
				verified: false,
			},
			data
		);
	}
}
