// Generated by CoffeeScript 1.6.3
(function() {
  var App, Backbone, Config, Doc, NProgress, app, _;

  require("jquery");

  _ = require("underscore");

  Backbone = require("backbone");

  NProgress = require("nprogress");

  Config = {
    clientId: "671657367079.apps.googleusercontent.com"
  };

  Doc = Backbone.Model.extend({
    initialize: function() {}
  });

  App = Backbone.View.extend({
    el: ".app",
    events: {
      "click .auth button": function(e) {
        return this.auth(false, function() {
          this.hideAuth();
          return this.showPick();
        });
      },
      "click .pick button": "pick"
    },
    initialize: function() {
      $(document).ajaxStart(function() {
        return NProgress.start();
      }).ajaxStop(function() {
        return NProgress.done();
      });
      return this.load();
    },
    load: function() {
      NProgress.start();
      gapi.load("auth,client", _.bind(function() {
        return gapi.client.load("drive", "v2", _.bind(function() {
          return this.loadPicker(function() {
            NProgress.done();
            return this.auth(true, _.bind(function(token) {
              if (token && !token.error) {
                this.hideAuth();
                return this.showPick();
              } else {
                return this.showAuth();
              }
            }, this));
          });
        }, this));
      }, this));
      return this;
    },
    loadPicker: function(cb) {
      google.load("picker", "1", {
        callback: _.bind(function() {
          this.picker = new google.picker.PickerBuilder().addView(google.picker.ViewId.DOCS).setCallback(_.bind(this.pickerCb, this)).build();
          return _.bind(cb, this)();
        }, this)
      });
      return this;
    },
    auth: function(immediate, cb) {
      gapi.auth.authorize({
        client_id: Config.clientId,
        scope: "https://www.googleapis.com/auth/drive",
        immediate: immediate
      }, _.bind(cb, this));
      return this;
    },
    showAuth: function() {
      this.$(".auth").show();
      return this;
    },
    hideAuth: function() {
      this.$(".auth").hide();
      return this;
    },
    pick: function(e) {
      this.picker.setVisible(true);
      return this;
    },
    showPick: function() {
      return this.$(".pick").show();
    },
    pickerCb: function(data) {
      var fileId;
      switch (data[google.picker.Response.ACTION]) {
        case google.picker.Action.PICKED:
          fileId = data[google.picker.Response.DOCUMENTS][0].id;
          this.loadDoc(fileId, function() {
            return this.showOpen();
          });
      }
      return this;
    },
    loadDoc: function(fileId, cb) {
      var req;
      req = gapi.client.drive.files.get({
        fileId: fileId
      });
      req.execute(_.bind(function(doc) {
        return $.ajax({
          url: doc.downloadUrl,
          type: 'get'
        }).done(function(resp) {
          console.log(resp);
          return _.bind(cb, this)();
        }).fail(function() {
          return console.error("Failed to load doc");
        });
      }, this));
      return this;
    },
    showOpen: function() {
      this.$(".open").show();
      return this;
    }
  });

  app = new App();

}).call(this);
