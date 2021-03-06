/**
 * Created with JetBrains WebStorm.
 * User: _CORE7
 * Date: 11.07.13
 * Time: 20:18
 * To change this template use File | Settings | File Templates.
 */

var DamageableEntity = Class.create( CollidableEntity, {
    initialize: function( $super, world, bitmap, hp ){
        $super( world, bitmap );

        this.stats = {
            hp: hp,
            maxHp: hp
        };
    },

    hit: function( damage ){
        this.stats.hp = Math.clip( this.stats.hp - damage, 0, this.stats.maxHp );
        if( this.stats.hp == 0 ) this.onDead();
        else this.onHit();
    },

    onDead: function(){
        var ai = createjs.Sound.play("explosion"); ai.setVolume( 0.3 );
    },

    onHit: function(){
        createjs.Sound.play("hit");
    },

    isAlive: function( $super ){
        return $super() && this.stats.hp > 0;
    }
});