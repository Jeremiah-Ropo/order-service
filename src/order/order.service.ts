import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderModel.create(createOrderDto);
      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(query: any, { limit, page }) {
    try {
      const orders = await this.orderModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();
      return orders;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id);
    return order;;
  }

  async findOne(query: any) {
    try {
      const order = await this.orderModel.findOne(query);
      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const updatedOrder = await this.orderModel.findByIdAndUpdate({ _id: id }, updateOrderDto, { new: true })
      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateOrdersByProduct(productId: string, { productName, productPrice }) {
    try {
      const updatedOrder = await this.orderModel.findByIdAndUpdate({ productId }, {name: productName, totalPrice: productPrice}, { new: true })
      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: string) {
    try {
      const deleteOrder = await this.orderModel.findByIdAndDelete(id);
      return deleteOrder;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
