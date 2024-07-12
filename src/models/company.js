class CompanyInfo {
  constructor(
    id,
    name,
    email,
    mobile,
    website,
    company_website,
    facebook_link,
    telegram_chat,
    contact_us_link,
    google_map_link,
    country,
    state,
    city,
    zip_code,
    pointExchange,
    description,
    address,
    exchange_riel,
    enable_rp,
    latitude,
    longitude,
    area_zone_free_delivery,
    over_zone_limit,
    over_zone_charge,
    operation_hour,
    open_hour,
    close_hour,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.website = website;
    this.company_website = company_website;
    this.facebook_link = facebook_link;
    this.telegram_chat = telegram_chat;
    this.contact_us_link = contact_us_link; //google_map_link
    this.google_map_link = google_map_link; //google_map_link
    this.country = country;
    this.state = state;
    this.city = city;
    this.zip_code = zip_code;
    this.address = address;
    this.pointExchange = pointExchange;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.area_zone_free_delivery = area_zone_free_delivery;
    this.over_zone_limit = over_zone_limit;
    this.over_zone_charge = over_zone_charge;
    this.operation_hour = operation_hour;
    this.open_hour = open_hour;
    this.close_hour = close_hour;
    this.exchange_riel = exchange_riel;
    this.enable_rp = enable_rp;
  }
}
export default CompanyInfo;
