import I18n from "I18n";
import EmberObject from "@ember/object";
import {
  setting,
  propertyEqual,
  propertyNotEqual,
  fmt,
  i18n,
  url,
  htmlSafe
} from "discourse/lib/computed";
import { setPrefix } from "discourse-common/lib/get-url";
import { discourseModule } from "helpers/qunit-helpers";

discourseModule("lib:computed", {
  beforeEach() {
    sandbox.stub(I18n, "t").callsFake(function(scope) {
      return "%@ translated: " + scope;
    });
  },

  afterEach() {
    I18n.t.restore();
  }
});

QUnit.test("setting", function(assert) {
  var t = EmberObject.extend({
    vehicle: setting("vehicle"),
    missingProp: setting("madeUpThing")
  }).create();

  this.siteSettings.vehicle = "airplane";
  assert.equal(
    t.get("vehicle"),
    "airplane",
    "it has the value of the site setting"
  );
  assert.ok(
    !t.get("missingProp"),
    "it is falsy when the site setting is not defined"
  );
});

QUnit.test("propertyEqual", assert => {
  var t = EmberObject.extend({
    same: propertyEqual("cookies", "biscuits")
  }).create({
    cookies: 10,
    biscuits: 10
  });

  assert.ok(t.get("same"), "it is true when the properties are the same");
  t.set("biscuits", 9);
  assert.ok(!t.get("same"), "it isn't true when one property is different");
});

QUnit.test("propertyNotEqual", assert => {
  var t = EmberObject.extend({
    diff: propertyNotEqual("cookies", "biscuits")
  }).create({
    cookies: 10,
    biscuits: 10
  });

  assert.ok(!t.get("diff"), "it isn't true when the properties are the same");
  t.set("biscuits", 9);
  assert.ok(t.get("diff"), "it is true when one property is different");
});

QUnit.test("fmt", assert => {
  var t = EmberObject.extend({
    exclaimyUsername: fmt("username", "!!! %@ !!!"),
    multiple: fmt("username", "mood", "%@ is %@")
  }).create({
    username: "eviltrout",
    mood: "happy"
  });

  assert.equal(
    t.get("exclaimyUsername"),
    "!!! eviltrout !!!",
    "it inserts the string"
  );
  assert.equal(
    t.get("multiple"),
    "eviltrout is happy",
    "it inserts multiple strings"
  );

  t.set("username", "codinghorror");
  assert.equal(
    t.get("multiple"),
    "codinghorror is happy",
    "it supports changing properties"
  );
  t.set("mood", "ecstatic");
  assert.equal(
    t.get("multiple"),
    "codinghorror is ecstatic",
    "it supports changing another property"
  );
});

QUnit.test("i18n", assert => {
  var t = EmberObject.extend({
    exclaimyUsername: i18n("username", "!!! %@ !!!"),
    multiple: i18n("username", "mood", "%@ is %@")
  }).create({
    username: "eviltrout",
    mood: "happy"
  });

  assert.equal(
    t.get("exclaimyUsername"),
    "%@ translated: !!! eviltrout !!!",
    "it inserts the string and then translates"
  );
  assert.equal(
    t.get("multiple"),
    "%@ translated: eviltrout is happy",
    "it inserts multiple strings and then translates"
  );

  t.set("username", "codinghorror");
  assert.equal(
    t.get("multiple"),
    "%@ translated: codinghorror is happy",
    "it supports changing properties"
  );
  t.set("mood", "ecstatic");
  assert.equal(
    t.get("multiple"),
    "%@ translated: codinghorror is ecstatic",
    "it supports changing another property"
  );
});

QUnit.test("url", assert => {
  var t, testClass;

  testClass = EmberObject.extend({
    userUrl: url("username", "/u/%@")
  });

  t = testClass.create({ username: "eviltrout" });
  assert.equal(
    t.get("userUrl"),
    "/u/eviltrout",
    "it supports urls without a prefix"
  );

  setPrefix("/prefixed");
  t = testClass.create({ username: "eviltrout" });
  assert.equal(
    t.get("userUrl"),
    "/prefixed/u/eviltrout",
    "it supports urls with a prefix"
  );
});

QUnit.test("htmlSafe", assert => {
  const cookies = "<p>cookies and <b>biscuits</b></p>";
  const t = EmberObject.extend({
    desc: htmlSafe("cookies")
  }).create({ cookies });

  assert.equal(t.get("desc").string, cookies);
});
