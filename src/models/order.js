import moment from 'moment';

class Order {
  constructor(
    id,
    status,
    totalAmount,
    date,
    is_suspend,
    delivered_to,
    method,
    saving_points,
    service_type,
    order_number,
    final_total,
    invoid_note,
    packing_charge
  ) {
    this.id = id;
    this.status = status;
    this.totalAmount = totalAmount;
    this.date = date;
    this.is_suspend = is_suspend;
    this.delivered_to = delivered_to;
    this.method = method;
    this.saving_points = saving_points;
    this.service_type = service_type;
    this.order_number = order_number;
    this.final_total = final_total;
    this.invoid_note = invoid_note;
    this.packing_charge = packing_charge;
  }
}

export default Order;

export class OrderType {
  constructor(id, name, description, packing_charge, packing_charge_type) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.packing_charge = packing_charge;
    this.packing_charge_type = packing_charge_type;
  }
}
