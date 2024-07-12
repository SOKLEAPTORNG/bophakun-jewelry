/**
 * notification
 */

class Notification {
  constructor(id, title, description, created_date, image, type, uid) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.created_date = created_date;
    this.image = image;
    this.type = type;
    this.uid = uid;
  }
}

export default Notification;
