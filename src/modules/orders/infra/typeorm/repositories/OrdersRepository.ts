import { getRepository, Repository, getConnection } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
    });

    await this.ormRepository.save(order);

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(OrdersProducts)
      .values(
        products.map(product => ({
          product_id: product.id,
          order_id: order.id,
          price: product.price * product.quantity,
          quantity: product.quantity,
        })),
      )
      .execute();

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return undefined;
  }
}

export default OrdersRepository;
