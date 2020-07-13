import I18n from "I18n";
import Sharing from "discourse/lib/sharing";

export default {
  name: "sharing-sources",

  initialize: function(container) {
    const siteSettings = container.lookup("site-settings:main");

    Sharing.addSource({
      id: "twitter",
      icon: "fab-twitter-square",
      generateUrl: function(link, title, quote = "") {
        const text = quote ? `"${quote}" -- ` : title;
        return `http://twitter.com/intent/tweet?url=${encodeURIComponent(
          link
        )}&text=${encodeURIComponent(text)}`;
      },
      shouldOpenInPopup: true,
      title: I18n.t("share.twitter"),
      popupHeight: 265
    });

    Sharing.addSource({
      id: "facebook",
      icon: "fab-facebook",
      title: I18n.t("share.facebook"),
      generateUrl: function(link, title, quote = "") {
        const fb_url = siteSettings.facebook_app_id
          ? `https://www.facebook.com/dialog/share?app_id=${
              siteSettings.facebook_app_id
            }&quote=${encodeURIComponent(quote)}&href=`
          : "https://www.facebook.com/sharer.php?u=";

        return `${fb_url}${encodeURIComponent(link)}`;
      },
      shouldOpenInPopup: true
    });

    Sharing.addSource({
      id: "email",
      icon: "envelope-square",
      title: I18n.t("share.email"),
      generateUrl: function(link, title, quote = "") {
        const text = quote ? `"${quote}"\r\n\r\n${link}` : link,
          subject = `[${siteSettings.title}] ${title}`;

        return `mailto:?to=&subject=${subject}&body=${encodeURIComponent(
          text
        )}`;
      },
      showInPrivateContext: true
    });
  }
};
