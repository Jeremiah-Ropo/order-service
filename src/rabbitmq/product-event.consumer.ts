import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OrderService } from '../order/order.service';

@Injectable()
export class ProductEventConsumer {
  constructor(private readonly orderService: OrderService) {}

  // This method listens to RabbitMQ messages with the routing key 'product.updated'
  @RabbitSubscribe({
    exchange: 'productExchange',
    routingKey: 'product.updated', // Routing key for the event
    queue: 'product-updates-queue', // Queue name for product updates
  })
  public async handleProductUpdateEvent(message: { productId: string; name: string; price: number }) {
    const { productId, name, price } = message;

    console.log(`Product updated: ${productId}, Name: ${name}, Price: ${price}`);

    // Business logic to update orders based on the updated product details
    await this.orderService.updateOrdersByProduct(productId, { productName: name, productPrice: price });
  }
}
