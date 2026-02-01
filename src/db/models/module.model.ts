import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { z } from "zod";
import { createStringSchema } from "../../utils/schema.util";

@pre<Module>("save", function () {
    this.updatedAt = new Date();
})

export class Module {

    @prop({ required: true, trim: true })
    public name!: string;

    // @prop({ ref: () => Course, type: () => String })
    // public courseId?: Ref<Role>;
    @prop({ required: true, trim: true })
    public courseId!: string;

    @prop({ default: Date.now })
    public createdAt?: Date;

    @prop({ default: Date.now })
    public updatedAt?: Date;
}

// Get the Mongoose model
export const ModuleModel = getModelForClass(Module);

// Zod schemas derived from the Typegoose model
export const ModuleCreateSchema = z.object({
    name: createStringSchema(true, 2, 100),
    // courseId:createObjectIdSchema(true)
    courseId: createStringSchema(true, 2, 100)

});

export const ModuleUpdateSchema = ModuleCreateSchema.partial();


// Type inference from Zod schemas
export type ModuleCreateInput = z.infer<typeof ModuleCreateSchema>;
export type ModuleUpdateInput = z.infer<typeof ModuleUpdateSchema>;
