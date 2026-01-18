import type { Otp, OtpTargetType } from "../db/models/otp.model";
import { OtpModel } from "../db/models/otp.model";

export class OtpRepository {
	async create(data: Partial<Otp>) {
		return await OtpModel.create(data);
	}

	// * verified မဖြစ်သေးတဲ့ ဟာကို ရှာ

	async findByEmail(email: string, source: OtpTargetType) {
		return await OtpModel.findOne({
			email,
			verified: false,
			type: source,
		});
	}

	// * verified မဖြစ်သေးတဲ့ ဟာကို ရှာ ပီး verified လုပ်
	async update({
		email,
		otp,
		source,
		data,
	}: {
		email: string;
		otp: string;
		source: OtpTargetType;
		data: Partial<Otp>;
	}) {
		return await OtpModel.findOneAndUpdate(
			{
				email,
				otp,
				type: source,
				verified: false,
			},
			data,
		);
	}
}
