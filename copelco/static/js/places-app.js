(function(){
    window.TastypieModel = Backbone.Model.extend({
        base_url: function() {
          var temp_url = Backbone.Model.prototype.url.call(this);
          return (temp_url.charAt(temp_url.length - 1) == '/' ? temp_url : temp_url+'/');
        },

        url: function() {
          return this.base_url();
        }
    });

    window.TastypieCollection = Backbone.Collection.extend({
        parse: function(response) {
            this.recent_meta = response.meta || {};
            return response.objects || response;
        }
    });

    window.Type = window.TastypieModel.extend({
        urlRoot: TYPES_API
    });

    window.Types = window.TastypieCollection.extend({
        url: TYPES_API,
        model: Type
    });

    window.Place = window.TastypieModel.extend({
        urlRoot: PLACES_API
    });

    window.Places = window.TastypieCollection.extend({
        url: PLACES_API,
        model: Place
    });

    window.Group = window.TastypieModel.extend({
        urlRoot: GROUPS_API
    });

    window.Groups = window.TastypieCollection.extend({
        url: GROUPS_API,
        model: Group
    });

    window.TypeListItemView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click a': 'getPlaces'
        },

        initialize: function(){
            _.bindAll(this, 'getPlaces');
            this.model.bind('change', this.render, this);
        },

        getPlaces: function(e) {
            e.preventDefault();
            window.router.navigate("type/" + this.model.get('id'), {trigger: true});
        },

        render: function(){
            var anchor = $('<a href="#">').addClass('type').text(this.model.get('name'));
            $(this.el).html(anchor);
            return this;
        }
    });

    window.TypeListView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'addOne', 'render');
            this.collection.bind('add', this.addOne);
            this.render();
        },

        addOne: function(group) {
            var view = new TypeListItemView({model: group});
            $(this.el).prepend(view.render().el);
        },

        render: function() {
            this.collection.each(this.addOne);
            return this;
        }
    });

    window.GroupView = Backbone.View.extend({
        tagName: 'li',
        className: 'group',

        events: {
            'click a': 'getPlaces'
        },

        initialize: function(){
            _.bindAll(this, 'getPlaces');
            this.model.bind('change', this.render, this);
        },

        getPlaces: function(e) {
            e.preventDefault();
            window.router.navigate("group/" + this.model.attributes.id, {trigger: true});
        },

        render: function(){
            $(this.el).html(ich.groupView(this.model.toJSON()));
            return this;
        }
    });

    window.GroupList = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'addOne', 'render');
            this.collection.bind('add', this.addOne);
        },

        addOne: function(group) {
            var view = new GroupView({model: group});
            $(this.el).prepend(view.render().el);
        },

        render: function() {
            this.collection.each(this.addOne);
            return this;
        }
    });

    window.PlaceListItemView = Backbone.View.extend({
        tagName: 'li',
        className: 'place',

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        render: function(){
            $(this.el).html(ich.placeListItem(this.model.toJSON()));
            return this;
        }                                        
    });

    window.PlaceListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne');
            this.collection.bind('add', this.addOne);
        },

        addOne: function(place){
            var view = new PlaceListItemView({model: place});
            $(this.el).prepend(view.render().el);
        },

        render: function() {
            $(this.el).html(ich.placeListApp({}));
            this.collection.each(this.addOne);
            return this;
        }
    });

    window.PlaceListApp = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'update', 'query');
            this.options.active_type.bind('change', this.update);
        },

        query: function(query) {
            var data = {};
            if (this.options.active_type.has('id') ) {
                data['type'] = this.options.active_type.get('id');
            }
            return data;
        },

        update: function() {
            this.collection.fetch({
                data: this.query(),
                success: _.bind(this.render, this)
            });
        },

        render: function() {
            $(this.el).html(ich.placeListApp({type: this.options.active_type.attributes.name}));
            var placeListView = new PlaceListView({
                collection: this.collection,
                el: this.$('#places')
            });
            this.collection.each(placeListView.addOne);
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

    window.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'placeList',
            'type/:id': 'placeListByType',
        },

        placeList: function() {
            window.app.active_type.clear();
            window.app.placeListApp.update();
        },

        placeListByType: function(id) {
            // update active_type id and call fetch to trigger change
            window.app.active_type.set('id', id, {silent: true});
            window.app.active_type.fetch();
        }
    });

    $(function(){
        window.app = window.app || {};
        window.app.types = new Types();
        window.app.types.reset(INITIAL_TYPES);
        window.app.typeListView = new TypeListView({
            el: $('#types'),
            collection: window.app.types,
        });
        window.app.active_type = new Type();
        // window.app.group = new Group();
        window.app.places = new Places();
        window.app.placeListApp = new PlaceListApp({
            el: $("#placeList"),
            collection: window.app.places,
            active_type: window.app.active_type
        });
        window.router = new AppRouter();
        Backbone.history.start();
        





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
