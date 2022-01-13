interface IBoard {
  _id: string;
}

interface IBoardModel {
  id: string;
}

export function BoardModel(data: IBoard): IBoardModel {
  return {
    id: data._id,
  };
}