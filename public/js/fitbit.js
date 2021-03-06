var fitbit = {
  client_id : "",
  callback : "",
  expires_in : 604800,
  auth : { },

  initialize : function(data) {
    this.callback = encodeURIComponent(data.callback);
    this.client_id = data.client_id;
    if (data.expires_in) {
      this.expires_in = data.expires_in;
    }
  },

  getURL : function() {
    if (this.client_id.length && this.callback.length) {
      return "https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=" + this.client_id + "&redirect_uri="
        + this.callback +"&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=" + this.expires_in;
    } else {
      return "";
    }
  },

  request : function(req, callback) {
    if (!(this.isAuth() && req.url && req.method)) {
      callback(null);
      return false;
    }
    var fitbitReq = { };
    fitbitReq.url = "https://api.fitbit.com/1/user/" + this.auth.user_id + req.url;
    fitbitReq.method = req.method;
    fitbitReq.headers = {
      "Authorization" : "Bearer " + this.auth.access_token
    };
    fitbitReq.async = true;
    if (req.postData) {
      fitbitReq.data = req.postData;
    }
    fitbitReq.complete = function(data, textStatus) {
      if (callback) {
        if (data.status == 200) {
          callback(data.responseJSON);
        } else {
          callback({ error : textStatus });
        }
      }
    };
    $.ajax(fitbitReq);
  },

  checkAuth : function() {
    var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    for (var key in params) {
      this.auth[key] = params[key];
    }
  },

  isAuth : function() {
    if (this.auth.access_token) {
      return true;
    }
  }
}
