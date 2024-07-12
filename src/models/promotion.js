import PropType from 'prop-types';

class Promotion {
  static propTypes = {
    id: PropType.number,
    name: PropType.string,
    image: PropType.string,
    create_at: PropType.oneOfType([PropType.string, PropType.number]),
    start_at: PropType.oneOfType([PropType.string, PropType.number]),
    end_at: PropType.oneOfType([PropType.string, PropType.number]),
    category_id: PropType.number,
    is_active: PropType.oneOfType([PropType.bool, PropType.number]),
    discount_amount: PropType.oneOfType([PropType.string, PropType.string]),
    discount_type: PropType.oneOfType([PropType.string, PropType.string]),
    discription: PropType.string,
  };
  constructor(
    id,
    name,
    image,
    create_at,
    start_at,
    end_at,
    category_id,
    is_active,
    discount_amount,
    discount_type,
    description,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.create_at = create_at;
    this.start_at = start_at;
    this.end_at = end_at;
    this.category_id = category_id;
    this.is_active = is_active;
    this.discount_amount = discount_amount;
    this.discount_type = discount_type;
    this.description = description;
  }
}

export default Promotion;
