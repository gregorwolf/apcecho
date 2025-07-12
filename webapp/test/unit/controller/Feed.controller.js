/*global QUnit*/

sap.ui.define([
	"com/sap/scn/gw/apcecho/controller/Feed.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Feed Controller");

	QUnit.test("I should test the Feed controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
