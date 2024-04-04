'use client'

export default class Store<T> {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  getAll(): T[] {
    const storedItems = localStorage.getItem(this.key)
    return storedItems ? JSON.parse(storedItems) : []
  }

  putAll(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items))
  }

  addItem(item: T): void {
    const items = this.getAll()
    items.push(item)
    this.putAll(items)
  }

  updateItem(predicate: (item: T) => boolean, updater: (item: T) => T): void {
    const items = this.getAll()
    const updatedItems = items.map((item) => {
      if (predicate(item)) {
        return updater(item)
      }
      return item
    })
    this.putAll(updatedItems)
  }

  deleteItem(predicate: (item: T) => boolean): void {
    const items = this.getAll()
    const updatedItems = items.filter((item) => !predicate(item))
    this.putAll(updatedItems)
  }

  getItem(predicate: (item: T) => boolean): T | null {
    const items = this.getAll()
    const needle =
      items.find((item) => {
        return predicate(item)
      }) || null
    return needle
  }
}
