/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */

var Bullet = Class.create( Entity, {
    initialize: function( $super, world, x, y, vx, vy, damage, bitmap ){
        $super( world, bitmap );

        this.shape.x = this.x = x;
        this.shape.y = this.y = y;
        this.shape.rotation = -Math.atan2( vx, vy ) * 180 / Math.PI - 90;

        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
    },

    update: function( $super, deltaTime ){
        this.x += this.vx;
        this.y += this.vy;

        this.shape.x = this.x;
        this.shape.y = this.y;
    },

    isAlive: function( $super ){
        return $super() && !(this.x < -20 || this.x >= this.stage.canvas.getWidth() + 20 || this.y < -20 || this.y >= this.stage.canvas.getHeight() + 20 );
    },

    destroy: function( $super ){
        this.stage.removeChild( this.shape );
    }
});

var EnemyBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-0.png" );
    }
});

var PlayerBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-8.png" );
    }
});