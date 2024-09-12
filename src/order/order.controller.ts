import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('productId') productId?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    try {
      const query = {};
      if (productId) query['productId'] = productId;
      if (ownerId) query['ownerId'] = ownerId;
      return this.orderService.findAll(query, { page, limit });
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.orderService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode)
    }
  }

  @Get()
  async findOne(@Query('field') field: string, @Query('value') value: string) {
    try {
      if (!field || !value) {
        throw new NotFoundException('Field or Value is missing');
      }

      const query = { [field]: value };
      const owner = await this.orderService.findOne(query);
      if (!owner) {
        throw new NotFoundException(
          `Owner with ${field}: ${value} is not found`,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      return this.orderService.update(id, updateOrderDto);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.orderService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
