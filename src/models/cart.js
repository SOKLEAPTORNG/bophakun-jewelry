class CartItem {
  constructor(
    id,
    qty,
    price,
    name,
    sum,
    size,
    image,
    note,
    cat_id,
    variations_id,
  ) {
    this.id = id;
    this.qty = qty;
    this.price = price;
    this.name = name;
    this.sum = sum;
    this.size = size;
    this.image = image;
    this.note = note;
    this.cat_id = cat_id;
    this.variations_id = variations_id;
  }
}
export default CartItem;
