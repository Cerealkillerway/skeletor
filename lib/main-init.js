import nestedProperty from 'nested-property';

// Global configuration load
// WARNING: this is a PUBLIC object => DO NOT store here reserved informations);
Skeletor.configuration = Meteor.settings.public.configuration;

// subscriptions manager!
Skeletor.subsManagers = {
    global: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    settingsSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),

    usersSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    rolesSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    sectionsSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    pagesSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    menusSubs: new SubsManager({cacheLimit: 100, expireIn: 864000})
};

// init registry, an object that is resetted on unser change
Skeletor.Registry = {};

// object to register app's custom global functions
Skeletor.globalFunctions = {};

Skeletor.configurationDefaults = {
    login: {
        defaultLoginPath: '/login',
        defaultLogoutPath: '/login',
        defaultRedirectPath: '/panel/dashboard',
        defaultFailPath: '/login'
    },
    animations: {
        onRendered: 300,
        scrollBottom: 300,
        scrollTop: 300,
        scrollError: 200
    },
    defaultLandingPage: '/pages/home'
};


setConfigDefaults = function(currentConfiguration) {
    let defaults = _.deepKeys(Skeletor.configurationDefaults);

    defaults.forEach(function(keyPath) {
        let currentValue = nestedProperty.get(currentConfiguration, keyPath);
        let defaultValue = nestedProperty.get(Skeletor.configurationDefaults, keyPath);


        if (!currentValue || currentValue === '') {
            nestedProperty.set(currentConfiguration, keyPath, defaultValue);
        }
    });
}

// languages
detectLang = function() {
    'use strict';
    let userLang = window.navigator.userLanguage || window.navigator.language;

    userLang = userLang.substr(0,2);

    if (Skeletor.configuration.lang.supported.indexOf(userLang) < 0) return "it";
    return userLang;
};


if (Meteor.isClient) detectedLang = detectLang();


// APPLICATION INITIALIZATION
// --------------------------------------------------------------------------
Skeletor.startup = function() {
    'use strict';
    if (Meteor.isClient) {

        FlowRouter.wait();
        detectedLang = detectLang();

        // set lsPolicy default
        if (!localStorage.getItem('lsPolicy')) {
            localStorage.setItem('lsPolicy', 1);
            Session.set('lsPolicyBar', true);
        }
        else {
            let state = localStorage.getItem('lsPolicy');

            Session.set('lsPolicyBar', false);
            if (parseInt(state) > 0) Session.set('lsPolicyBar', true);
        }

        Skeletor.Registry.configurationChanged = new ReactiveVar(false);
        Skeletor.Registry.configurationReady = new ReactiveVar(false);

        let flowRouterInit = false;

        Skeletor.subsManagers.settingsSubs.subscribe('findDocuments', 'Settings', {code: 'publicAppConf'}, {}, function() {
            Tracker.autorun(function() {
                let configurationChanged = Skeletor.Registry.configurationChanged.get();
                Skeletor.Registry.configurationReady.set(false);

                _.extend(Skeletor.configuration, Skeletor.Data.Settings.findOne({code: 'publicAppConf'}));

                SkeleUtils.GlobalUtilities.logger('loaded configuration:', 'skeletor');
                SkeleUtils.GlobalUtilities.logger(Skeletor.configuration, 'skeletor');

                if (!flowRouterInit) {
                    FlowRouter.initialize();
                    flowRouterInit = true;
                }

                // HEADERS
                document.title = Skeletor.configuration.name;

                // SET DEFAULTS
                // set moment's default language
                moment.locale(Skeletor.configuration.lang.default);

                // set application default language
                Session.set('siteLangs', Skeletor.configuration.lang.enabled);
                Session.set('siteLangs', Skeletor.configuration.langEnable);
                Skeletor.configuration.lang.enabled = Skeletor.configuration.langEnable;

                // set real ls-policy
                if (Skeletor.configuration.lsPolicyBar.displayAlways) {
                    Session.set('lsPolicyBar', true);
                }

                // set moment's language
                moment.locale(detectedLang);

                // reset reactive var
                if (configurationChanged) {
                    Skeletor.Registry.configurationChanged.set(false);
                }
                Skeletor.Registry.configurationReady.set(true);
            });
        });

        Tracker.autorun(function() {
            if (Skeletor.Registry.configurationReady.get()) {
                let langParam = FlowRouter.getQueryParam('lang');

                // set enabled language
                if (Skeletor.configuration.langEnable[langParam]) {
                    TAPi18n.setLanguage(langParam);
                }
                else {
                    //set real user language if is available, otherwise will keep defaults
                    if (Skeletor.configuration.langEnable[detectedLang]) {
                        TAPi18n.setLanguage(detectedLang);
                    }
                    else {
                        TAPi18n.setLanguage(Skeletor.configuration.lang.default);
                    }
                }

                setConfigDefaults(Skeletor.configuration);

                SkeleUtils.GlobalUtilities.logger('loaded configuration:', 'skeletor');
                SkeleUtils.GlobalUtilities.logger(Skeletor.configuration, 'skeletor');
            }
        });

        // USER ROLES
        // get current user's role documents
        Skeletor.currentUserRoles = new ReactiveVar(false);

        // global subscription to current user's roles is not cached; since it is called inside an autorun cycle
        // it is automatically stopped when the user changes (clears the minimongo cache)
        Tracker.autorun(function() {
            let currentUser = Meteor.user();

            // subscription it's registered inside an autorun loop so that it's automatically stopped
            // when it is rerun
            Skeletor.rolesSubscription = Meteor.subscribe('findDocuments', 'Roles', {}, {});

            if (Skeletor.rolesSubscription.ready()) {
                if (currentUser) {
                    let rolesIds = currentUser.profile.roles;
                    let roles = Skeletor.Data.Roles.find({_id: {$in: rolesIds}});

                    Skeletor.currentUserRoles.set(roles);
                }
            }
        });

        // things to do when the DOM is ready
        Meteor.startup(function() {
        });
    }
};
