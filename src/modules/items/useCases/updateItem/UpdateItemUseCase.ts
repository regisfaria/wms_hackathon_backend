import { Item } from '@modules/items/infra/typeorm/entities/Item';
import { IItemsRepository } from '@modules/items/repositories/IItemsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  userId: string;
  name?: string;
  category?: string;
  minimumStock?: number;
  daysToNotifyExpirationDate?: number;
  measureUnity?: string;
}

class UpdateItemUseCase {
  constructor(private itemsRepository: IItemsRepository) {}
  async execute({
    category,
    daysToNotifyExpirationDate,
    id,
    measureUnity,
    minimumStock,
    name,
    userId,
  }: IRequest): Promise<Item> {
    if (!category && !measureUnity && !name) {
      throw new AppError(
        'Você não pode acessar esse serviço sem fornecer nenhum valor novo. Tente atualizar pelo menos um valor.',
      );
    }

    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new AppError('Nenhum item encontrado com o ID fornecido.');
    }
    if (name) {
      const nameAlreadyExist = await this.itemsRepository.findByNameFromUser(
        name,
        userId,
      );

      if (nameAlreadyExist) {
        throw new AppError('Item já cadastrado');
      }

      item.name = name;
    }

    if (category) {
      item.category = category;
    }
    if (daysToNotifyExpirationDate) {
      if (daysToNotifyExpirationDate >= 0) {
        item.daysToNotifyExpirationDate = daysToNotifyExpirationDate;
      } else {
        throw new AppError('Data para notificar sobre a validade invalido.');
      }
    }

    if (measureUnity) {
      item.measureUnity = measureUnity;
    }

    if (minimumStock) {
      if (minimumStock >= 0) {
        item.minimumStock = minimumStock;
      } else {
        throw new AppError('Estoque minimo invalido.');
      }
    }

    await this.itemsRepository.update(item);

    return item;
  }
}

export { UpdateItemUseCase };
