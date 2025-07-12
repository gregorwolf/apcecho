sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/format/DateFormat"],
  (Controller, DateFormat) => {
    "use strict";

    return Controller.extend("com.sap.scn.gw.apcecho.controller.Feed", {
      oTimeConv: DateFormat.getDateTimeInstance({
        pattern: "yyyyMMddHHmmss",
      }),
      oFormat: DateFormat.getDateTimeInstance({
        style: "medium",
      }),
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       * @memberOf com.sap.scn.gw.apcecho.view.Feed
       */
      getWsConnection: function (oModel) {
        // Establish WebSocket connection
        jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket");
        this.oWs = new sap.ui.core.ws.SapPcpWebSocket(
          "/sap/bc/apc/sap/zapc_echo",
          sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10
        );

        this.oWs.attachOpen(function (e) {
          sap.m.MessageToast.show("Websocket connection opened");
        });

        this.oWs.attachClose(
          function (e) {
            sap.m.MessageToast.show("Websocket connection closed");
            setTimeout(
              function () {
                this.getWsConnection(oModel);
              }.bind(this),
              1000
            );
          }.bind(this)
        );

        this.oWs.attachMessage(
          function (oEvent) {
            if (oEvent.getParameter("pcpFields").errorText) {
              // Message is an error text
              return;
            }
            // Parse Message
            var oEntry = JSON.parse(oEvent.getParameter("data"));
            // Format Timestamp
            var ts = this.oTimeConv.parse(oEntry.LS_MESSAGE.DATE);
            oEntry.Date = this.oFormat.format(ts);
            // update model
            var aEntries = oModel.getData().EntityCollection;
            aEntries.unshift(oEntry);
            oModel.refresh();
          }.bind(this)
        );
      },

      onInit: function () {
        // Check if WebSockets are supported
        if (!sap.ui.Device.support.websocket) {
          sap.m.MessageBox.show(
            "Your SAPUI5 Version does not support WebSockets",
            {
              icon: sap.m.MessageBox.Icon.INFORMATION,
              title: "WebSockets not supported",
              actions: sap.m.MessageBox.Action.OK,
            }
          );
          return;
        }

        var oModel = new sap.ui.model.json.JSONModel({
          EntityCollection: [],
        });
        this.getView().setModel(oModel);
        this.getWsConnection(oModel);
      },

      onPost: function () {
        this.oWs.send(this.byId("feedInput").getValue());
      },

      /**
       * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
       * (NOT before the first rendering! onInit() is used for that one!).
       * @memberOf com.sap.scn.gw.apcecho.view.Feed
       */
      //  onBeforeRendering: function() {
      //
      //  },

      /**
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       * @memberOf com.sap.scn.gw.apcecho.view.Feed
       */
      //  onAfterRendering: function() {
      //
      //  },

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       * @memberOf com.sap.scn.gw.apcecho.view.Feed
       */
      //  onExit: function() {
      //
      //  }
    });
  }
);
