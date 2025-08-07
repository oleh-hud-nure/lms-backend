import { toJSONPlugin } from 'core/plugins';
import mongoose, { Schema } from 'mongoose';

export namespace User {
    export interface IBase {
        id: string
        name: string
        email: string
    }

    const UserSchema = new Schema<IBase>({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    })

    UserSchema.plugin(toJSONPlugin)

    export const Model = mongoose.model<IBase>('User', UserSchema)
}

