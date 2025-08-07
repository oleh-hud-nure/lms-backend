import { Schema } from "mongoose";

export function toJSONPlugin(schema: Schema, post: CallableFunction) {
    schema.set('toJSON', {
        transform(doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    });
}

