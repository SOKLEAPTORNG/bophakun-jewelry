class CartOrderItems {
  constructor(
    id,
    name,
    price,
    quantity,
    sub_amount,
    discount_amount,
    discount_type,
    unit_price_before_discount,
    item_note,
    image,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.sub_amount = sub_amount;
    this.discount_amount = discount_amount;
    this.discount_type = discount_type;
    this.unit_price_before_discount = unit_price_before_discount;
    this.item_note = item_note;
    this.image = image;
  }
}

export default CartOrderItems;
