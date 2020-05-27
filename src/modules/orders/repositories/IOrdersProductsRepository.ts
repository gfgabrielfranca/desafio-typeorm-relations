import OrdersProducts from '../infra/typeorm/entities/OrdersProducts';

import ICreateOrdersProductsDTO from '../dtos/ICreateOrdersProductsDTO';

export default interface IOrdersProductsRepository {
  create(data: ICreateOrdersProductsDTO): Promise<OrdersProducts>;
}
