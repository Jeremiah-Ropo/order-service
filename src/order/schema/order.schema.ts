import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose"

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    }
})
export class Order {
    @Prop()
    productIds: Array<string>;

    @Prop()
    quanitity: string;

    @Prop()
    totalPrice: number;
}
 
export const OrderSchema = SchemaFactory.createForClass(Order)
