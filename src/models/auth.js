class User {
  constructor(id, uid, name, email, mobile, fcm_token, total_rp, avatar) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.fcm_token = fcm_token;
    this.total_rp = total_rp;
    this.avatar = avatar;
  }
}

export default User;
