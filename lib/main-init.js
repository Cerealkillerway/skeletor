import nestedProperty from 'nested-property'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { Tracker } from 'meteor/tracker'


// Global configuration load
// WARNING: this is a PUBLIC object => DO NOT store here reserved informations)
Skeletor.configuration = Meteor.settings.public.configuration

// subscriptions managers!
// these are cleaned if the logged in user changes
Skeletor.subsManagers = {
    usersSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    rolesSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    countersSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    sectionsSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    pagesSubs: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    menusSubs: new SubsManager({cacheLimit: 100, expireIn: 864000})
}

// these persist sessions
Skeletor.persistentSubsManagers = {
    global: new SubsManager({cacheLimit: 100, expireIn: 864000}),
    menusSubs: new SubsManager({cacheLimit: 100, expireIn: 864000})
}

// init registry, an object that is resetted on unser change
Skeletor.Registry = {}

// object to register app's custom global functions
Skeletor.globalFunctions = {}

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
    timeMachine: {
        defaultLimit: 11,
    },
    defaultLandingPage: '/pages/home',
    staticFilesPath: ''
}


Skeletor.setConfigDefaults = function(currentConfiguration) {
    let defaults = _.deepKeys(Skeletor.configurationDefaults)

    defaults.forEach(function(keyPath) {
        let currentValue = nestedProperty.get(currentConfiguration, keyPath)
        let defaultValue = nestedProperty.get(Skeletor.configurationDefaults, keyPath)


        if (!currentValue || currentValue === '') {
            nestedProperty.set(currentConfiguration, keyPath, defaultValue)
        }
    })
}


// detect user agent's language and decides then which language to use
detectLang = function() {
    'use strict'
    let userLang = window.navigator.userLanguage || window.navigator.language

    userLang = userLang.substr(0,2)
    if (Skeletor.configuration.consoleLogger) {
        SkeleUtils.GlobalUtilities.logger(`Detected user language: ${userLang}`, 'skeletor', true)
    }

    if (!Skeletor.configuration.langEnable[userLang]) {
        return Skeletor.configuration.lang.default
    }
    Skeletor.configuration.detectedLang = userLang
    return userLang
}



// APPLICATION INITIALIZATION
// --------------------------------------------------------------------------
Skeletor.startup = function() {
    'use strict'
    // client side global configuration loading ad handling of depending states
    if (Meteor.isClient) {
        FlowRouter.wait()

        // set lsPolicy default
        if (!localStorage.getItem('lsPolicy')) {
            localStorage.setItem('lsPolicy', 1)
            Session.set('lsPolicyBar', true)
        }
        else {
            let state = localStorage.getItem('lsPolicy')

            Session.set('lsPolicyBar', false)
            if (parseInt(state) > 0) Session.set('lsPolicyBar', true)
        }

        Skeletor.Registry.configurationChanged = new ReactiveVar(false)

        let flowRouterInit = false
        let detectedLang

        Meteor.subscribe('findDocuments', 'Settings', {}, {}, function() {
            Tracker.autorun(function() {
                let configurationChanged = Skeletor.Registry.configurationChanged.get()
                let settingsDocuments = Skeletor.Data.Settings.find({code: {$in: ['applicationData', 'publicAppConf']}}).fetch()

                for (settings of settingsDocuments) {
                    _.extend(Skeletor.configuration, settings)
                }

                // HEADERS
                document.title = Skeletor.configuration.appName

                // GET USER LANGUAGE
                detectedLang = detectLang()

                // set real ls-policy
                if (Skeletor.configuration.lsPolicyBar.displayAlways) {
                    Session.set('lsPolicyBar', true)
                }

                // reset reactive var
                if (configurationChanged) {
                    Skeletor.Registry.configurationChanged.set(false)
                }

                if (!flowRouterInit) {
                    FlowRouter.initialize()
                    flowRouterInit = true
                }

                const routerState = FlowRouter.current()
                // get langParam non reactively
                let langParam

                if (routerState.queryParams) {
                    langParam = routerState.queryParams.lang
                }
                else if (routerState.params) {
                    langParam = routerState.queryParams.itemLang
                }
                else {
                    langParam = Skeletor.configuration.lang.default
                }

                // set enabled language
                if (Skeletor.configuration.langEnable[langParam]) {
                    Skeletor.Skelelang.i18n.setLocale(langParam)
                    moment.locale(langParam)
                }
                else {
                    //set real user language if is available, otherwise will keep defaults
                    if (Skeletor.configuration.langEnable[detectedLang]) {
                        Skeletor.Skelelang.i18n.setLocale(detectedLang)
                        moment.locale(detectedLang)
                    }
                    else {
                        Skeletor.Skelelang.i18n.setLocale(Skeletor.configuration.lang.default)
                        moment.locale(Skeletor.configuration.lang.default)
                    }
                }

                Skeletor.setConfigDefaults(Skeletor.configuration)

                if (Skeletor.configuration.consoleLogger) {
                    SkeleUtils.GlobalUtilities.logger('loaded configuration:', 'skeletor', true)
                    SkeleUtils.GlobalUtilities.logger(Skeletor.configuration, 'skeletor', true)
                }
            })
        })

        // USER ROLES
        // get current user's role documents
        Skeletor.currentUserRoles = new ReactiveVar(false)

        // global subscription to current user's roles is not cached since it is called inside an autorun cycle
        // it is automatically stopped when the user changes (clears the minimongo cache)
        Tracker.autorun(function() {
            let currentUser = Meteor.user()

            if (currentUser) {
                let roles = currentUser.profile.roles

                // subscription it's registered inside an autorun loop so that it's automatically stopped
                // when it is rerun
                Skeletor.rolesSubscription = Meteor.subscribe('findDocuments', 'Roles', {_id: { $in: roles}}, {})

                if (Skeletor.rolesSubscription.ready()) {
                    let rolesIds = currentUser.profile.roles
                    let roles = Skeletor.Data.Roles.find({_id: {$in: rolesIds}})

                    Skeletor.currentUserRoles.set(roles)
                }
            }
        })

        // things to do when the DOM is ready
        Meteor.startup(function() {
        })
    }
}
