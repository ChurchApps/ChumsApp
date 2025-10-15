export interface Sortable { sort?: number }

export function ensureSequentialSort<T extends Sortable>(items: T[] = []): void {
  for (let i = 0; i < items.length; i++) items[i].sort = i + 1;
}

export function moveItemUp<T extends Sortable>(items: T[], index: number): void {
  if (!items || index <= 0 || index >= items.length) return;
  ensureSequentialSort(items);
  items[index - 1].sort!++;
  items[index].sort!--;
}

export function moveItemDown<T extends Sortable>(items: T[], index: number): void {
  if (!items || index < 0 || index >= items.length - 1) return;
  ensureSequentialSort(items);
  items[index].sort!++;
  items[index + 1].sort!--;
}
