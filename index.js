const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')
canvas.width=1024
canvas.height=576

const gravity=0.5

c.fillRect(0,0,canvas.width,canvas.height)



const player=new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x:0,
        y:0
    },imageSrc: './img/samuraiMack/Idle.png',
    frames: 8,
    scale: 2.5,
    offset: {
        x:215,
        y:157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            frames: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            frames: 6
        },takeHit:{
            imageSrc: './img/samuraiMack/Take Hit.png',
            frames: 4
        },
        death:{
            imageSrc: './img/samuraiMack/Death.png',
            frames: 6
        }
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width: 160,
        height: 50
    }
})

const enemy=new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x:-50,
        y:0
    },imageSrc: './img/kenji/Idle.png',
    frames: 4,
    scale: 2.5,
    offset: {
        x:215,
        y:167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frames: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            frames: 4
        },
        takeHit:{
            imageSrc: './img/kenji/Take hit.png',
            frames: 3
        },
        death:{
            imageSrc: './img/kenji/Death.png',
            frames: 7
        }
    },
    attackBox:{
        offset:{
            x:-160,
            y:50
        },
        width: 160,
        height: 50
    }
})

const background=new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1,
    frames: 1
})

const shop=new Sprite({
    position: {
        x: 600,
        y: 163
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    frames: 6
})

enemy.color='blue'

player.draw()
enemy.draw()
console.log(player)

const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle='rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x=0
    if(player.lastKey==='d' && keys.d.pressed){
        player.velocity.x=5
        player.switchSprite('run')
    }else if(player.lastKey==='a' && keys.a.pressed){
        player.velocity.x=-5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    if(player.velocity.y<0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }

    //enemy movement
    enemy.velocity.x=0
    if(keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x=-5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
        enemy.velocity.x=5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }
    if(enemy.velocity.y<0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }

    // collision detection
    if(rectangularCollision({rectangle1:player,rectangle2:enemy}) &&
        player.isAttacking && player.currentframe===4
    ){
        enemy.takeHit()
        player.isAttacking=false
        document.querySelector('#enemyHealth').style.width=enemy.health+'%'
    }

    //if the player misses
    if(player.isAttacking && player.currentframe===4){
        player.isAttacking=false
    }

    if(rectangularCollision({rectangle1:enemy,rectangle2:player}) &&
        enemy.isAttacking && enemy.currentframe===2
    ){
        player.takeHit()
        enemy.isAttacking=false
        document.querySelector('#playerHealth').style.width=player.health+'%'      
    }
    if(enemy.isAttacking && enemy.currentframe===2){
        enemy.isAttacking=false
    }

    //ending game based on health
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player,enemy,timerId})
    }
} 


animate()

window.addEventListener('keydown',(event)=>{

    if(!player.dead){
        switch(event.key){

            case 'd':
            keys.d.pressed=true
            player.lastKey='d'
            break

            case 'a':
            keys.a.pressed=true
            player.lastKey='a'
            break

            case 'w':
            if(player.velocity.y===0){
                player.velocity.y=-15
            }
            break

            case ' ':
            player.attack()
            break
        }
    }   
    if(!enemy.dead){
        switch(event.key){

            case 'ArrowDown':
            enemy.attack()
            break

            case 'ArrowRight':
            keys.ArrowRight.pressed=true
            enemy.lastKey='ArrowRight'
            break

            case 'ArrowLeft':
            keys.ArrowLeft.pressed=true
            enemy.lastKey='ArrowLeft'
            break

            case 'ArrowUp':
            if(enemy.velocity.y===0) enemy.velocity.y=-15
            break;
        }
    }
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
        keys.d.pressed=false
        break

        case 'a':
        keys.a.pressed=false
        break

        case 'ArrowRight':
        keys.ArrowRight.pressed=false
        break

        case 'ArrowLeft':
        keys.ArrowLeft.pressed=false
        break
        
    }
})  