import {business_info} from '../constant/index';
import OrderItems from './orderItems';
import {guidGenerator} from '../utils/index';
class AddOrders extends OrderItems {
  constructor(contact_id, totalAmount, pay_method, addeOrderCartItems) {
    super();
    this.business_id = business_info.business_id.toString();
    this.status = 'draft';
    this.payment_status = 'paid';
    this.is_quotation = '0';
    this.transaction_date = this.getDate();
    this.total_before_tax = totalAmount;
    this.tax_amount = '0';
    this.rp_redeemed = '0';
    this.rp_redeemed_amount = '0';
    this.shipping_charges = '0';
    this.round_off_amount = totalAmount;
    this.final_total = totalAmount;
    this.is_direct_sale = '0';
    this.is_suspend = '0';
    this.exchange_rate = '1';
    this.created_by = business_info.created_by.toString();
    this.is_created_from_api = '0';
    this.essentials_duration = '0';
    this.essentials_amount_per_unit_duration = '0';
    this.rp_earned = '0';
    this.is_recurring = '0';
    this.created_at = this.getDate();
    this.updated_at = this.getDate();
    this.location_id = business_info.location_id.toString();
    this.type = 'sell';
    this.contact_id = contact_id;
    this.customer_group_id = '';
    this.invoice_no = this.invoice_no();
    this.ref_no = '';
    this.tax_id = '';
    this.discount_type = 'percentage';
    this.discount_amount = '0';
    this.additional_notes = '';
    this.staff_note = '';
    this.commission_agent = '';
    this.shipping_details = '';
    this.shipping_address = '';
    this.shipping_status = '';
    this.delivered_to = '';
    this.selling_price_group_id = '0';
    this.pay_term_number = '';
    this.pay_term_type = '';
    this.recur_interval = '';
    this.recur_interval_type = 'days';
    this.subscription_repeat_on = '';
    this.subscription_no = '';
    this.recur_repetitions = '0';
    this.order_addresses = '';
    this.sub_type = '';
    this.types_of_service_id = '';
    this.packing_charge = '0';
    this.packing_charge_type = '';
    this.service_custom_field_1 = '';
    this.service_custom_field_2 = '';
    this.service_custom_field_3 = '';
    this.service_custom_field_4 = '';
    this.import_batch = '';
    this.import_time = '';
    this.transaction_type = 'sell';
    this.pay_method = pay_method;
    this.cash_register_id = '1';
    this.products = addeOrderCartItems;
  }
  invoice_no() {
    return guidGenerator();
  }
}
export default AddOrders;
