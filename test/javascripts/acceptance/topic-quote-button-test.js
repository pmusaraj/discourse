import I18n from "I18n";
import { acceptance } from "helpers/qunit-helpers";

function selectText(selector) {
  const range = document.createRange();
  const node = document.querySelector(selector);
  range.selectNodeContents(node);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

acceptance("Topic - Quote button - logged in", {
  loggedIn: true
});

QUnit.test("Does not show the quote share buttons by default", async assert => {
  await visit("/t/internationalization-localization/280");
  selectText("#post_5 blockquote");
  assert.ok(exists(".insert-quote"), "it shows the quote button");
  assert.equal(
    find(".quote-sharing").length,
    0,
    "it does not show quote sharing"
  );
});

QUnit.test(
  "Shows quote share buttons with the right site settings",
  async function(assert) {
    this.siteSettings.share_quote_visibility = "all";
    this.siteSettings.share_quote_buttons = "twitter|email";

    await visit("/t/internationalization-localization/280");
    selectText("#post_5 blockquote");

    assert.ok(exists(".quote-sharing"), "it shows the quote sharing options");
    assert.ok(
      exists(`.quote-sharing .btn[title='${I18n.t("share.twitter")}']`),
      "it includes the twitter share button"
    );
    assert.ok(
      exists(`.quote-sharing .btn[title='${I18n.t("share.email")}']`),
      "it includes the email share button"
    );
  }
);

acceptance("Topic - Quote button - anonymous", {
  loggedIn: false,
  settings: {
    share_quote_visibility: "anonymous",
    share_quote_buttons: "twitter|email"
  }
});

QUnit.test(
  "Shows quote share buttons with the right site settings",
  async function(assert) {
    await visit("/t/internationalization-localization/280");
    selectText("#post_5 blockquote");

    assert.ok(find(".quote-sharing"), "it shows the quote sharing options");
    assert.ok(
      exists(`.quote-sharing .btn[title='${I18n.t("share.twitter")}']`),
      "it includes the twitter share button"
    );
    assert.ok(
      exists(`.quote-sharing .btn[title='${I18n.t("share.email")}']`),
      "it includes the email share button"
    );
    assert.equal(
      find(".insert-quote").length,
      0,
      "it does not show the quote button"
    );
  }
);

QUnit.test(
  "Shows single share button when site setting only has one item",
  async function(assert) {
    this.siteSettings.share_quote_buttons = "twitter";

    await visit("/t/internationalization-localization/280");
    selectText("#post_5 blockquote");

    assert.ok(exists(".quote-sharing"), "it shows the quote sharing options");
    assert.ok(
      exists(`.quote-sharing .btn[title='${I18n.t("share.twitter")}']`),
      "it includes the twitter share button"
    );
    assert.equal(
      find(".quote-share-label").length,
      0,
      "it does not show the Share label"
    );
  }
);

QUnit.test("Shows nothing when visibility is disabled", async function(assert) {
  this.siteSettings.share_quote_visibility = "none";

  await visit("/t/internationalization-localization/280");
  selectText("#post_5 blockquote");

  assert.equal(
    find(".quote-sharing").length,
    0,
    "it does not show quote sharing"
  );

  assert.equal(
    find(".insert-quote").length,
    0,
    "it does not show the quote button"
  );
});

// QUnit.test("Quoting a quote keeps the original poster name", async assert => {
//   await visit("/t/internationalization-localization/280");
//   selectText("#post_5 blockquote");
//   await click(".quote-button");

//   assert.ok(
//     find(".d-editor-input")
//       .val()
//       .indexOf('quote="codinghorror said, post:3, topic:280"') !== -1
//   );
// });

// QUnit.test(
//   "Quoting a quote with the Reply button keeps the original poster name",
//   async assert => {
//     await visit("/t/internationalization-localization/280");
//     selectText("#post_5 blockquote");
//     await click(".reply");

//     assert.ok(
//       find(".d-editor-input")
//         .val()
//         .indexOf('quote="codinghorror said, post:3, topic:280"') !== -1
//     );
//   }
// );

// QUnit.test(
//   "Quoting a quote with replyAsNewTopic keeps the original poster name",
//   async assert => {
//     await visit("/t/internationalization-localization/280");
//     selectText("#post_5 blockquote");
//     await keyEvent(document, "keypress", "j".charCodeAt(0));
//     await keyEvent(document, "keypress", "t".charCodeAt(0));

//     assert.ok(
//       find(".d-editor-input")
//         .val()
//         .indexOf('quote="codinghorror said, post:3, topic:280"') !== -1
//     );
//   }
// );

// QUnit.test(
//   "Quoting by selecting text can mark the quote as full",
//   async assert => {
//     await visit("/t/internationalization-localization/280");
//     selectText("#post_5 .cooked");
//     await click(".quote-button");

//     assert.ok(
//       find(".d-editor-input")
//         .val()
//         .indexOf('quote="pekka, post:5, topic:280, full:true"') !== -1
//     );
//   }
// );
