// global application configuration data
var staticFolder = "verticalrock_static";

//WARNING: this is a PUBLIC object => DO NOT store here reserved informations);
Skeletor.configuration = {
    name: Meteor.settings.public.configuration.name,
    appName: Meteor.settings.public.configuration.appName,
    siteName: Meteor.settings.public.configuration.siteName,
    siteDetail: Meteor.settings.public.configuration.siteDetail,
    mainEmail: Meteor.settings.public.configuration.mainEmail,
    webmasterEmail: Meteor.settings.public.configuration.webmasterEmail,

    version: Meteor.settings.public.configuration.version,

    author: {
        name: Meteor.settings.public.configuration.author.name,
        website: Meteor.settings.public.configuration.author.website,
        websiteText: Meteor.settings.public.configuration.author.websiteText
    },

    debug: Meteor.settings.public.configuration.debug,

    defaultLandingPage: '/pages/home',
    defaultFilePath: {
        local: "/var/www/" + staticFolder,
        remote: "/var/www/igor/" + staticFolder
    },
    absoluteFilePath: {
        local: 'http://localhost/' + staticFolder,
        remote: 'http://144.76.103.88/' + staticFolder
    },
    login: {
        defaultLoginPath: '/login',                  //default path of login screen
        defaultLogoutPath: '/login',                 //default path to redirect to after logout
        defaultRedirectPath: '/panel/dashboard',     //default path to redirect to after login
        defaultFailPath: '/'                         //default path to redirect to if login fails (anti brute force redirect)
    },
    defaultMethods: {
        insert: 'insertDocument',
        update: 'updateDocument',
        delete: 'deleteDocument'
    },
    
    social: Meteor.settings.public.configuration.social,
    lang: Meteor.settings.public.configuration.lang
};

GlobalConf = undefined;

// subscriptions manager!
subman = new SubsManager({cacheLimit: 100, expireIn: 864000});


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

// Language utility functions
swapLangForm = function(lang, rendered) {
    var id = '#' + lang + "Form";
    var time;

    if (rendered) time = 0;
    else time = 300;    
    
    $('.panelForm').not(id).animate({left: -3000}, time, function() {
        $('.panelForm').not(id).css({display: 'none'});
    });

    $(id).animate({left: 0}, time, function() {
        $(id).css({display: 'block'});
    });
};

changeRouteLang = function(newLang, frontEnd) {
    TAPi18n.setLanguage(newLang);

    FlowRouter.setQueryParams({"lang": newLang});
};


// Static files folders
if (Meteor.absoluteUrl().indexOf('localhost') > 0 || Meteor.absoluteUrl().indexOf('127.0.0.1') > 0) currentLocation = 'local';
else currentLocation = "remote";




// APPLICATION INITIALIZATION
// --------------------------------------------------------------------------
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

    subman.subscribe("findDocuments", "Settings", {code: "publicAppConf"}, {}, function() {
        GlobalConf = Skeletor.Data.Settings.findOne({code: 'publicAppConf'});

        FlowRouter.initialize();

        var langParam = FlowRouter.getQueryParam("lang");

        if (GlobalConf.langEnable[langParam]) {
            TAPi18n.setLanguage(langParam);
        }
        else {
            //set real user language if is available, otherwise will keep defaults
            if (GlobalConf.langEnable[detectedLang]) {
                TAPi18n.setLanguage(detectedLang);
            }
            else {
                TAPi18n.setLanguage(Skeletor.configuration.lang.default);
            }
        }

        Session.set('siteLangs', GlobalConf.langEnable);
        Skeletor.configuration.lang.enabled = GlobalConf.langEnable;

        //set real ls-policy
        if (GlobalConf.lsPolicyBar.displayAlways) Session.set('lsPolicyBar', true);

        //set moment's language
        moment.locale(detectedLang);
        
    });

    //add summernote.js' plugins
    //editorPlugins();

    //things to do when the DOM is ready
    Meteor.startup(function() {
    });
}
