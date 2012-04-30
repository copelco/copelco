(function(){
    window.Place = Backbone.Model.extend({
        urlRoot: PLACES_API
    });

    window.Places = Backbone.Collection.extend({
        urlRoot: PLACES_API,
        model: Place
    });

    window.Group = Backbone.Model.extend({
        urlRoot: GROUPS_API
    });

    window.Groups = Backbone.Collection.extend({
        urlRoot: GROUPS_API,
        model: Group
    });

    window.PlaceView = Backbone.View.extend({
        tagName: 'li',
        className: 'place',

        events: {
            'click .permalink': 'navigate'           
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        navigate: function(e){
            this.trigger('navigate', this.model);
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.placeTemplate(this.model.toJSON()));
            return this;
        }                                        
    });

    window.GroupView = Backbone.View.extend({
        tagName: 'li',
        className: 'group',

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        render: function(){
            $(this.el).html(ich.groupView(this.model.toJSON()));
            return this;
        }   
    });

    window.GroupList = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.groupList(this.model.toJSON()));
            return this;
        }    
    });

    window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },
        
        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }                                        
    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(place){
            var view = new PlaceView({
                model: place
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        }

    });

    window.ListApp = Backbone.View.extend({
        el: "#app",

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },

        render: function(){
            $(this.el).html(ich.listApp({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#places')
            });
            list.addAll();
            // list.bind('all', this.rethrow, this);
            // new InputView({
            //     collection: this.collection,
            //     el: this.$('#input')
            // });
        }        
    });




    
    window.Router = Backbone.Router.extend({
        routes: {
            '': 'list',
            ':id/': 'detail'
        },

        navigate_to: function(model){
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },

        detail: function(){},

        list: function(){}
    });

    $(function(){
        window.app = window.app || {};
        app.groups = new Groups();
        app.groupList = new GroupList({
            el: $('#groupApp'),
            collection: app.groups
        });
        app.groups.fetch({
            success: _.bind(app.groupList.render, app.groupList)                
        });

        app.places = new Places();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.places
        });
        app.detail = new DetailApp({
            el: $("#app")
        });
        app.places.fetch({
            success: _.bind(app.list.render, app.list)                
        });

        // app.router = new Router();
        // app.router.bind('route:list', function(){
        //     app.places.fetch({
        //         success: _.bind(app.list.render, app.list)                
        //     });
        // });
        // app.router.bind('route:detail', function(id){
        //     app.tweets.getOrFetch(app.tweets.urlRoot + id + '/', {
        //         success: function(model){
        //             app.detail.model = model;
        //             app.detail.render();                    
        //         }
        //     });
        // });
        // app.list.bind('navigate', app.router.navigate_to, app.router);
        // app.detail.bind('home', app.router.navigate_to, app.router);
        // Backbone.history.start({
        //     pushState: true, 
        //     silent: app.loaded
        // });
    });
})();
