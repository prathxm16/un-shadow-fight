class Sprite {
    constructor({position,imageSrc,scale=1,frames=1,offset={x:0,y:0}}){
        this.position=position
        this.width=50
        this.height=150
        this.image=new Image()
        this.image.src=imageSrc
        this.scale=scale
        this.frames=frames
        this.currentframe=0
        this.elapsedFrames=0
        this.frameHold=10
        this.offset=offset
        
    }
    draw(){
        c.drawImage(
            this.image,
            this.currentframe*(this.image.width/this.frames),
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x-this.offset.x,
            this.position.y-this.offset.y,
            this.image.width/this.frames *this.scale,
            this.image.height*this.scale
        )
    }
    animateFrames() {
        this.elapsedFrames++
        if(this.elapsedFrames%this.frameHold===0){
            this.currentframe= (this.currentframe+1)%this.frames
        }
    }
    update() {
        this.draw()
        this.animateFrames()   
    }
}

class Fighter extends Sprite{
    constructor({position,
        velocity,
        color='red',
        imageSrc,
        scale=1,
        frames=1,
        offset={x:0,y:0},
        sprites,
        attackBox={offset:{},width:undefined,height:undefined}
    }) {
        super({
            position,
            imageSrc,
            scale,
            frames,
            offset})

        this.velocity=velocity
        this.width=50
        this.height=150
        this.lastKey
        this.attackBox={
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color=color
        this.isAttacking
        this.health=100

        this.currentframe=0
        this.elapsedFrames=0
        this.frameHold=15
        this.sprites=sprites
        this.dead=false
        for(const sprite in this.sprites){
            sprites[sprite].image=new Image()
            sprites[sprite].image.src=sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }
    
    update() {
        this.draw()
        if(!this.dead) this.animateFrames()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.attackBox.position.x = this.position.x+this.attackBox.offset.x
        this.attackBox.position.y = this.position.y+this.attackBox.offset.y
        //c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        if(this.position.y+this.height+this.velocity.y>=canvas.height-95){
            this.velocity.y=0
            this.position.y=331
        }else {
            this.velocity.y+=gravity
        }
    }attack(){
        this.switchSprite('attack1')
        this.isAttacking=true;
    }
    takeHit(){
        this.health-=20
        if(this.health<=0){
            this.switchSprite('death')
        }else{
            this.switchSprite('takeHit')
        }

    }

    switchSprite(sprite){

        if(this.image===this.sprites.death.image){
            if(this.currentframe===this.sprites.attack1.frames-1){
                this.dead=true
            }return
        }
        //overriding all other animations with the attack animation
        if(this.image===this.sprites.attack1.image && this.currentframe<this.sprites.attack1.frames-1) return

        if(this.image===this.sprites.takeHit.image && this.currentframe<this.sprites.takeHit.frames-1) return

        switch(sprite){
            case 'idle':
                if(this.image!==this.sprites.idle.image){
                    this.image=this.sprites.idle.image
                    this.frames=this.sprites.idle.frames
                    this.currentframe=0
                }
            break
            case 'run':
                if(this.image!==this.sprites.run.image){
                    this.image=this.sprites.run.image
                    this.frames=this.sprites.run.frames
                    this.currentframe=0
                }
            break
            case 'jump':
                if(this.image!==this.sprites.jump.image){
                    this.image=this.sprites.jump.image
                    this.frames=this.sprites.jump.frames
                    this.currentframe=0
                }
            break
            case 'fall':
                if(this.image!==this.sprites.fall.image){
                    this.image=this.sprites.fall.image
                    this.frames=this.sprites.fall.frames
                    this.currentframe=0
                }
            break
            case 'attack1':
                if(this.image!==this.sprites.attack1.image){
                    this.image=this.sprites.attack1.image
                    this.frames=this.sprites.attack1.frames
                    this.currentframe=0
                }
            break
            case 'takeHit':
                if(this.image!==this.sprites.takeHit.image){
                    this.image=this.sprites.takeHit.image
                    this.frames=this.sprites.takeHit.frames
                    this.currentframe=0
                }
            break
            case 'death':
                if(this.image!==this.sprites.death.image){
                    this.image=this.sprites.death.image
                    this.frames=this.sprites.death.frames
                    this.currentframe=0
                }
            break
        }
    }
}