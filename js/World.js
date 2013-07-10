/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:50
 * To change this template use File | Settings | File Templates.
 */

var World = Class.create({
    initialize: function( stage ){
       this.stage = stage;
       this.entities = [];
       this.sequences = [];
       this.player = new Player( this );
    },

    update: function( deltaTime ){
        for( var i = this.entities.length - 1; i >= 0 ; i-- ){
            var e = this.entities[i];
            e.update( deltaTime );

            if( e instanceof Bullet ){
                if( e instanceof Bullet ){
                    var collision = ndgmr.checkPixelCollision( this.player.shape, e.shape );
                    if( collision ){
                        //this.player.damage( e.damage );
                        e.setAlive( false );
                    }
                }
            }

            if( !e.isAlive() ){
                e.destroy();
                this.entities.splice( i, 1 );
            }
        }

        for( var i = this.sequences.length - 1; i >= 0; i-- ){
            this.sequences[i].update( deltaTime );

            if( this.sequences[i].count == 0 ){
                this.sequences[i].destroy();
                this.sequences.splice( i, 1 );
            }
        }

        console.log( this.entities.length );
        this.player.update( deltaTime );
    },

    addEntity: function( e ){
        this.entities.push( e );
    },

    addSequence: function( path, tweenInfo, count, delay, types ){
        this.sequences.push( new EnemySequence( this, path, tweenInfo, count, delay, types ) );
    }
});