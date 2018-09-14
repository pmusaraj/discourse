import componentTest from "helpers/component-test";

moduleForComponent("tag-drop", {
  integration: true,
  beforeEach: function() {
    this.set("subject", selectKit());
  }
});

componentTest("default", {
  template: "{{tag-drop}}",

  beforeEach() {
    this.site.set("can_create_tag", true);
    this.set("site.top_tags", ["jeff", "neil", "arpit", "régis"]);

    const response = object => {
      return [200, { "Content-Type": "application/json" }, object];
    };

    // prettier-ignore
    server.get("/tags/filter/search", (params) => { //eslint-disable-line
      if (params.queryParams.q === "rég") {
        return response({
          "results": [
            { "id": "z3", "text": "z3", "count": 2, "pm_count": 0 },
            { "id": "z1", "text": "z1", "count": 1, "pm_count": 0 },
            { "id": "z2", "text": "z2", "count": 1, "pm_count": 0 }
          ]
        });
      }
    });
  },

  async test(assert) {
    await this.get("subject").expand();

    assert.equal(
      this.get("subject")
        .rowByIndex(0)
        .name(),
      "jeff",
      "it has the correct tag"
    );

    assert.equal(
      this.get("subject")
        .rowByIndex(1)
        .name(),
      "neil",
      "it has the correct tag"
    );

    await this.get("subject").fillInFilter("rég");
    assert.equal(
      this.get("subject")
        .rowByIndex(0)
        .name(),
      "régis",
      "it displays the searched tag"
    );
  }
});
