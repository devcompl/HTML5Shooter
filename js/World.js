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

        this.totalTime = 0;
        this.player = new Player( this );
        this.sequenceFactory = new EnemySequenceFactory( this );
        this.quadTree = new QuadTree( 0, 0,  this.stage.width,  this.stage.height, 0 );
        this.particleEmitter = new ParticleEmitter( this.stage );

        this.addEntity( this.player );
    },

    update: function( deltaTime ){
        this.totalTime += deltaTime;

        var i = this.entities.length;
        while( i-- ){
            var e = this.entities[i];

            if( !e.isAlive() ){
                this.removeEntityIndex( e, i );
                continue;
            }

            e.update( deltaTime );
        }

        i = this.sequences.length;
        while( i-- ){
            var s = this.sequences[i];
            s.update( deltaTime );

            if( s.finished() ){
                this.removeSequenceIndex( s, i );
            }
        }

        if( this.sequences.length < 3 ){
            this.sequences.push( this.sequenceFactory.getRandom() );
        }

        this.solveCollisions();
        //this.quadTree.draw( this.stage.context );
    },

    solveCollisions: function(){
        this.quadTree.clear();
        var i = this.entities.length;
        while( i-- ){
            var e = this.entities[i];
            if( e instanceof CollidableEntity ){
                if( e instanceof Bullet ){
                    this.quadTree.add( e, e.x - 4, e.y - 4, 8, 8 );
                }else{
                    this.quadTree.add( e, e.x - e.shape.width / 2, e.y - e.shape.height / 2, e.shape.width, e.shape.height );
                }
            }
        }

        i = this.entities.length;
        while( i-- ){
            var e = this.entities[i];
            if( e instanceof Player || e instanceof Enemy ){
                var others = this.quadTree.getElemsNearby(e.x, e.y, e.shape.width, e.shape.height);
                var j = others.length;
                while( j-- ){
                    var o = others[j];

                    if( !(o instanceof CollidableEntity) ) continue;
                    if( (e.maskFlags & o.categoryFlags) == 0 && (o.maskFlags & e.categoryFlags) == 0 ) continue;

                    var collision = false;
                    /*if( e instanceof Player )   collision = ndgmr.checkPixelCollision( e.shape, o.shape, 1 );
                    else */                       collision = ndgmr.checkRectCollision( e.shape, o.shape );
                    if( collision ){
                        o.onHit( e ); e.onHit( o );
                        if( o instanceof Bullet ){
                            if( e instanceof DamageableEntity ){
                                if(e.stats.hp > 0 ) {
                                    e.hit( o.damage );
                                    if( e.stats.hp == 0 ) o.onKill( e );
                                }
                            }
                            o.setAlive( false );

                            this.particleEmitter.emitMultiple( {x: e.x, y: e.y}, 30, ParticleEmitter.DEFAULT_PROPS, [ParticleEmitter.DEFAULT_PARTICLE]);
                        }else{
                            //e.hit( 5 );
                            //o.hit( 5 );
                        }
                    }
                }
            }
        }
    },

    addEntity: function( e ){
        this.entities.push( e );
    },

    removeEntity: function( e ){
        this.removeEntityIndex( e, this.entities.indexOf(e) );
    },

    removeEntityIndex: function( e, i ){
        e.destroy();
        this.entities.splice( i, 1 );
    },

    removeSequence: function( s ){
        this.removeSequenceIndex( e, this.sequences.indexOf(s) );
    },

    removeSequenceIndex: function( s, i ){
        s.destroy();
        this.sequences.splice( i, 1 );
    },

    addSequence: function( path, tweenInfo, count, delay, types ){
        this.sequences.push( new EnemySequence( this, path, tweenInfo, count, delay, types ) );
    }
});