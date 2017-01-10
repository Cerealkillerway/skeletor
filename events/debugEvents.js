// DEBUG TOOLBAR
// ==========================================================================================
Template.debugToolbar.events({
    // open/close actions
    'click #debugOpen': function(event, instance) {
        let container = $('#debugActionsContainer');
        let width = container.width() + 13;
        let position = parseInt(container.css('right'));

        if (position > 0) {
            localStorage.setItem('debugBarOpen', false);
            container.animate({right: '-' + width}, 300);
        }
        else {
            localStorage.setItem('debugBarOpen', true);
            container.animate({right: '28px'}, 300);
        }
    },
    // change current lang
    'click #debugLangChange': function(event, instance) {
        if (TAPi18n.getLanguage() === 'it') changeLang('en');
        else changeLang('it');
    },
    // toggle logger function
    'click #debugLogger': function(event, instance) {
        let btn = $(event.target).closest('.btn');
        let listBtns = btn.next('ul').find('.btn-floating');

        if (Session.get('consoleLogger')) {
            Session.set('consoleLogger', false);
            btn.removeClass('active');
            listBtns.removeClass('active');
        }
        else {
            Session.set('consoleLogger', true);
            btn.addClass('active');
            listBtns.addClass('active');
        }
    }
});

Template.debugToolbar.rendered = function() {
    this.$('.tooltipped').ckTooltip({delay: 10, container: this.$('#debugActionsContainer')});

    if (localStorage.getItem('debugBarOpen') !== 'true') $('#debugOpen').trigger('click');
};
