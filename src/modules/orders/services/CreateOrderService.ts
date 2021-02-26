import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Order from '../infra/typeorm/entities/Order';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const existentProducts = await this.productsRepository.findAllById(products);

    if (!existentProducts.length) {
      throw new AppError('Products not found');
    }

    const productsToSend = existentProducts.map(
      product => ({
        product_id: product.id,
        quantity: products.filter(p => p.id === product.id)[0].quantity,
        price: product.price,
      })
    )

    products.forEach(product => {
      const dbProduct = existentProducts.filter(p => p.id === product.id)[0];
      const inventory = dbProduct.quantity;

      if (product.quantity > inventory) {
        throw new AppError('Insufficient inventory');
      }
    })

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({ customer, products: productsToSend });

    return order;
  }
}

export default CreateOrderService;
