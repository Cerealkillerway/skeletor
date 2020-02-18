import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import 'materialize-css'


// Panel layout
Template.skelePanelLayout.onCreated(function() {
    Skeletor.appRendered = new ReactiveVar(false)
})

Template.skelePanelLayout.onRendered(function() {
    // if defined, call custom callback
    if (Skeletor.customCallbacks.skelePanelLayout.onRendered) {
        Skeletor.customCallbacks.skelePanelLayout.onRendered()
    }

    SkeleUtils.GlobalUtilities.skeleSetPanelBackground()

    // used by skeleform to understand when all templates are rendered (ex. to init staticbar)
    Skeletor.appRendered.set(true)
})

Template.skelePanelLayout.events({
    'click #logout'() {
        SkeleUtils.Accounts.logout()
    },
    'click .backTop'() {
        SkeleUtils.GlobalUtilities.scrollTo(0, Skeletor.configuration.animations.scrollTop)
    }
})


// Panel main menu
Template.panelMainMenu.onRendered(function() {
    this.sideNavInstance = M.Sidenav.init(this.find('.sidenav'), { edge: 'right' })

    SkeleUtils.GlobalUtilities.skeleSwingMenu(this.$('.iconSwing'))
})


// Panel nude layout
Template.skelePanelNudeLayout.onCreated(function() {
    Skeletor.appRendered = new ReactiveVar(false)
})
Template.skelePanelNudeLayout.onRendered(function() {
    SkeleUtils.GlobalUtilities.skeleSetPanelBackground()
    Skeletor.appRendered.set(true)
})


// unauthorized
Template.skeleUnauthorized.events({
    'click #backToLogin'() {
        FlowRouter.go(Skeletor.configuration.login.defaultLoginPath, {}, {lang: FlowRouter.current().queryParams.lang})
    }
})


// Login
Template.skeleLogin.onRendered(function() {
    this.$('#email').focus()
})
Template.skeleLogin.events({
    'keypress'(event, instance) {
        let email = instance.$('#email').val()
        let password = instance.$('#password').val()

        if (event.charCode === 13) {
            SkeleUtils.Accounts.loginWithPassword(email, password)
        }
    },
    'click #login'(event, instance) {
        let email = instance.$('#email').val()
        let password = instance.$('#password').val()

        SkeleUtils.Accounts.loginWithPassword(email, password)
    }
})


// Dashboard
Template.skelePanelDashboard.onRendered(function() {
    SkeleUtils.GlobalEvents.TooltipOnRendered(this)
})
Template.skelePanelDashboard.onDestroyed(function() {
    SkeleUtils.GlobalEvents.TooltipOnDestroyed(this)
})


// Settings
Template.settingCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false)
    // subscribe data
    let settingsQuery = {}

    this.autorun(() => {
        settingsQuery.code = 'publicAppConf'
        let currentSetting = Meteor.subscribe('findDocuments', 'Settings', settingsQuery, {})

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(currentSetting.ready())
    })
})


// Application data
Template.applicationDataCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false)
    // subscribe data
    let settingsQuery = {}

    this.autorun(() => {
        settingsQuery.code = 'applicationData'
        let currentSetting = Meteor.subscribe('findDocuments', 'Settings', settingsQuery, {})

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(currentSetting.ready())
    })
})


// Users
Template.usersList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Users_default', 'list')
})

Template.userCreate.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Users_default', 'detail')
})


// Roles
Template.rolesList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Roles_default', 'list')
})

Template.roleCreate.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Roles_default', 'detail')
})


Template.skeleTooltip.onRendered(function() {
    SkeleUtils.GlobalEvents.TooltipOnRendered(this)
})
Template.skeleTooltip.onDestroyed(function() {
    SkeleUtils.GlobalEvents.TooltipOnDestroyed(this)
})
