import { Schema } from "mongoose";

export function toJSONPlugin(schema: Schema) {
    schema.set('toJSON', {
        transform(doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    });
}

