import moment from 'moment';
import Proptype from 'prop-types';
export default class OrderItems {
  constructor(
    prod_id,
    var_id,
    qty,
    unit_price_before,
    unit_price,
    discount_type,
    discount_amount,
    item_price,
    note,
  ) {
    this.product_id = prod_id;
    this.variation_id = var_id;
    this.quantity = qty;
    this.quantity_returned = '0';
    this.unit_price_before_discount = unit_price_before;
    this.unit_price = unit_price;
    this.line_discount_type = discount_type;
    this.line_discount_amount = discount_amount;
    this.unit_price_inc_tax = discount_amount > 0 ? unit_price : item_price;
    this.item_tax = '0';
    this.tax_id = '';
    this.discount_id = '';
    this.lot_no_line_id = '';
    this.sell_line_note = note;
    this.res_service_staff_id = '';
    this.res_line_order_status = '';
    this.woocommerce_line_items_id = '';
    this.parent_sell_line_id = '';
    this.children_type = 'combo';
    this.sub_unit_id = '';
    this.created_at = this.getDate();
    this.updated_at = this.getDate();
  }
  getDate() {
    return moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
  }
}
OrderItems.propTypes = {
  prod_id: Proptype.number,
  var_id: Proptype.number,
  unit_price: Proptype.number,
};
