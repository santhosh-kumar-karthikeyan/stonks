interface IFreQ<T, IdT> {
  accessItem(itemId: IdT): void;
  removeItem(itemId: IdT): void;
  getSize(): number;
}

interface INode<T, IdT> {
  data: Partial<T>;
  prev: INode<T, IdT> | null;
  next: INode<T, IdT> | null;
}

export class Node<T, IdT> implements INode<T, IdT> {
  data: Partial<T> = {};
  prev: Node<T, IdT> | null = null;
  next: Node<T, IdT> | null = null;
}

export class FreQ<T, IdT extends string | number | symbol>
  implements IFreQ<T, IdT>
{
  private head: Node<T, IdT> | null = null;
  private tail: Node<T, IdT> | null = null;
  private map: Record<IdT, T> = {} as Record<IdT, T>;
  private size: number = 0;
  constructor(private capacity: number = Infinity) {}
  accessItem(itemId: IdT): void {
    if(this.head === null) {
        return; 
    }
    const node = this.map[itemId];
    if(this.head === node) {
        return; // already the most recently accessed item
    }

  }
  removeItem(itemId: IdT): void {}
  getSize(): number {
    return this.size;
  }
}
