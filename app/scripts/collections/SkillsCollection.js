define( function ( require ) {
        'use strict';

        var Backbone = require( 'backbone' );
        var util     = require( 'util' );

        /* Return a collection class definition */
        return Backbone.Collection.extend( {

                'initialize' : function () {},

                'url' : '/skills',

                'baucis' : util.baucisFetch

        } );

} );