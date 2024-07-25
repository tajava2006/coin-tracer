class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private front: QueueNode<T> | null = null;
  private rear: QueueNode<T> | null = null;
  private length: number = 0;

  // 큐에 요소 추가
  enqueue(element: T): void {
    const newNode = new QueueNode(element);
    if (this.rear) {
      this.rear.next = newNode;
    }
    this.rear = newNode;
    if (!this.front) {
      this.front = newNode;
    }
    this.length++;
  }

  // 큐에서 요소 제거
  dequeue(): T {
    if (!this.front) {
      throw new Error('Queue is empty');
    }
    const dequeuedNode = this.front;
    this.front = this.front.next;
    if (!this.front) {
      this.rear = null;
    }
    this.length--;
    return dequeuedNode.value;
  }

  // 큐의 앞쪽 요소 확인
  frontValue(): T {
    if (!this.front) {
      throw new Error('Queue is empty');
    }
    return this.front.value;
  }

  // 큐가 비어있는지 확인
  isEmpty(): boolean {
    return this.length === 0;
  }

  // 큐의 크기 확인
  size(): number {
    return this.length;
  }
}
