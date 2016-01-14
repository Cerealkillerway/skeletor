// Global configuration load
// WARNING: this is a PUBLIC object => DO NOT store here reserved informations);
Skeletor.configuration = Meteor.settings.public.configuration;

Skeletor.GlobalConf = undefined;

// subscriptions manager!
Skeletor.subman = new SubsManager({cacheLimit: 100, expireIn: 864000});


// languages
detectLang = function() {
    var userLang = window.navigator.userLanguage || window.navigator.language;
    userLang = userLang.substr(0,2);

    if (Skeletor.configuration.lang.supported.indexOf(userLang) < 0) return "it";
    return userLang;
};


if (Meteor.isClient) detectedLang = detectLang();


// defaults
appDefaults = {
    image: {
        quality: 0.7,
        width: 400,
        height: 400
    },
    thumb: {
        quality: 0.5,
        width: 200,
        height: 200
    },
    video: {
        width: 600,
        height: 400
    }
};



// APPLICATION INITIALIZATION
// --------------------------------------------------------------------------
Skeletor.startup = function() {
    if (Meteor.isClient) {
        FlowRouter.wait();
        detectedLang = detectLang();

        //HEADERS
        document.title = Skeletor.configuration.name;
        
        //SET DEFAULTS
        //set moment's default language
        moment.locale(Skeletor.configuration.lang.default);

        //set application default language
        Session.set('siteLangs', Skeletor.configuration.lang.enabled);

        //set lsPolicy default
        if (!localStorage.getItem('lsPolicy')) {
            localStorage.setItem('lsPolicy', 1);
            Session.set('lsPolicyBar', true);
        }
        else {
            var state = localStorage.getItem('lsPolicy');
            Session.set('lsPolicyBar', false);
            if (parseInt(state) > 0) Session.set('lsPolicyBar', true);
        }

        Skeletor.subman.subscribe("findDocuments", "Settings", {code: "publicAppConf"}, {}, function() {
            Skeletor.GlobalConf = Skeletor.Data.Settings.findOne({code: 'publicAppConf'});
            FlowRouter.initialize();

            var langParam = FlowRouter.getQueryParam("lang");

            if (Skeletor.GlobalConf.langEnable[langParam]) {
                TAPi18n.setLanguage(langParam);
            }
            else {
                //set real user language if is available, otherwise will keep defaults
                if (Skeletor.GlobalConf.langEnable[detectedLang]) {
                    TAPi18n.setLanguage(detectedLang);
                }
                else {
                    TAPi18n.setLanguage(Skeletor.configuration.lang.default);
                }
            }

            Session.set('siteLangs', Skeletor.GlobalConf.langEnable);
            Skeletor.configuration.lang.enabled = Skeletor.GlobalConf.langEnable;

            //set real ls-policy
            if (Skeletor.GlobalConf.lsPolicyBar.displayAlways) Session.set('lsPolicyBar', true);

            //set moment's language
            moment.locale(detectedLang);
            
        });

        //add summernote.js' plugins
        //editorPlugins();

        //things to do when the DOM is ready
        Meteor.startup(function() {
        });
    }
};
