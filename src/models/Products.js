class Products {
  constructor(
    id,
    name,
    price,
    image,
    business_id,
    category_id,
    sub_category_id,
    description,
    isFavorite,
    isNew,
    is_popular,
    is_recommend,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.business_id = business_id;
    this.category_id = category_id;
    this.sub_category_id = sub_category_id;
    this.description = description;
    this.isFavorite = isFavorite;
    this.isNew = isNew;
    this.is_popular = is_popular;
    this.is_recommend = is_recommend;
  }
}
// Products.propType = {
//   id: PropTyps.number.isRequired,
//   name: PropTyps.string.isRequired,
//   image: PropTyps.string.isRequired,
//   price: PropTyps.number.isRequired,
//   description: PropTyps.string.isRequired,
// };
export default Products;
