import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer do not exists.');
    }

    const findProducts = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );

    if (!findProducts.length) {
      throw new AppError('Product do not exists.');
    }

    const insufficientProduct = findProducts.find(
      (findProduct, index) => findProduct.quantity < products[index].quantity,
    );

    if (insufficientProduct) {
      throw new AppError('Product do not have sufficient quantity.');
    }

    const order = await this.ordersRepository.create({
      customer,
      products: findProducts,
    });

    return order;
  }
}

export default CreateProductService;
