import { BaseModel } from './BaseModel';
import { ICategory } from '../Interfaces/ICategory';

interface ICategoryModel extends BaseModel {
  title: string;
  description: string;
}

export function CategoryModel(data: ICategory): ICategoryModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
  };
}
