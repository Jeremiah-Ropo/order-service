import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ProductEventConsumer } from '../rabbitmq/product-event.consumer';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ProductEventConsumer],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'productExchange', // Name of the exchange from which product updates will be published
          type: 'topic',           // Exchange type (direct, topic, etc.)
        },
      ],
      uri: 'amqp://localhost:5672', // RabbitMQ server URI
    }),
  ]
})
export class OrderModule {}
