"use strict";
enchant();
var game;

window.onload = function() {

    game = new Game(320, 320);
    game.preload("aozora.jpg");
    game.onload = function() {
        // ここに処理を書いていきます。
        var label = new Label("enchant.jsの世界へようこそ！");
        game.rootScene.addChild(label);
        
        game.pushScene(new GameScene());
    };
    game.start();
};

var GameScene = Class.create(Scene, {
    initialize: function() {
        Scene.call(this);
        
        var background = new Sprite(320, 320);
        background.image = game.assets["aozora.jpg"];
        this.addChild(background);
        
        this.surfaceCanvas = new Surface(320, 320);
        this.surfaceCanvas.context.strokeStyle = '#000';
        this.spriteCanvas = new Sprite(320, 320);
        this.spriteCanvas.image = this.surfaceCanvas;
        this.addChild(this.spriteCanvas);
        
        this.surfaceBubble = new Surface(320, 320);
        this.surfaceBubble.context.strokeStyle = '#000';
        this.spriteBubble = new Sprite(320, 320);
        this.spriteBubble.image = this.surfaceBubble;
        this.addChild(this.spriteBubble);
        
        this.sprites = new Array();
        this.surfaces = new Array();
        this.sindex = 0;
        this.smax = 30;
        for (var i = 0; i < this.smax; i++) {
            this.sprites[i] = new Sprite(320, 320);
            this.surfaces[i] = new Surface(320, 320);
        }
    },
    ontouchstart: function(e) {
        this.beginX = e.x;
        this.beginY = e.y;
        this.xs = new Array();
        this.ys = new Array();
        this.ts = new Array();
        this.count = 0;
        
        this.xs[this.count] = e.x;
        this.ys[this.count] = e.y;
        this.ts[this.count] = (new Date()).getTime();
        this.count++;
        
        this.power = 0;
        
        this.surfaceCanvas.context.clearRect(0, 0, 320, 320);
        this.surfaceBubble.context.clearRect(0, 0, 320, 320);
    },
    ontouchmove: function(e) {
        this.surfaceCanvas.context.beginPath();
        this.surfaceCanvas.context.moveTo(this.beginX, this.beginY);
        this.surfaceCanvas.context.lineTo(e.x, e.y);
        this.surfaceCanvas.context.stroke();
        this.beginX = e.x;
        this.beginY = e.y;
        var time = (new Date()).getTime();
        var speed = Math.sqrt((e.x - this.xs[this.count - 1]) * (e.x - this.xs[this.count - 1]) + (e.y - this.ys[this.count - 1]) * (e.y - this.ys[this.count - 1])) / (time - this.ts[this.count - 1]);
        
        this.power += (time - this.ts[this.count - 1]) / 50;
        if (0.2 <= speed) {
            var r = this.power;
            if (r < 100) {
                r += 100 + Math.floor(Math.random() * 100);
            }
            var sp = this.sprites[this.sindex];
            var su = this.surfaces[this.sindex];
            this.sindex = (this.sindex + 1) % this.smax;
            sp.x = 0;
            sp.y = 0;
            su.context.clearRect(0, 0, 320, 320);
            su.context.strokeStyle = '#000';
            su.context.beginPath();
            su.context.arc(su.width / 2, su.height / 2, this.power, 0, Math.PI * 2);
            su.context.fillStyle = 'rgba(255,255,255,0.3)';
            su.context.fill();
            su.context.stroke();
            sp.image = su;
            this.addChild(sp);
            //sp.tl.moveTo(-160, -160, 30 + Math.floor(Math.random() * 10));
            sp.tl.moveBy(-30 + 60 * Math.random(), -80 + 50 * Math.random(), 30 + Math.floor(Math.random() * 10))
                 .moveBy(-30 + 60 * Math.random(), -80 + 50 * Math.random(), 30 + Math.floor(Math.random() * 10))
                 .removeFromScene();
            console.log("add");
            this.power = 0;
        } else {
            this.surfaceBubble.context.clearRect(0, 0, 320, 320);
            this.surfaceBubble.context.beginPath();
            this.surfaceBubble.context.arc(160, 160, this.power, 0, Math.PI * 2);
            this.surfaceBubble.context.fillStyle = 'rgba(255,255,255,0.3)';
            this.surfaceBubble.context.fill();
            this.surfaceBubble.context.stroke();
        }
        console.log(speed);
        
        this.xs[this.count] = e.x;
        this.ys[this.count] = e.y;
        this.ts[this.count] = time;
        this.count++;
    },
    ontouchend: function() {
        this.surfaceCanvas.context.clearRect(0, 0, 320, 320);
        this.surfaceBubble.context.clearRect(0, 0, 320, 320);
    }
});