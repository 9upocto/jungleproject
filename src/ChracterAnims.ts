import Phaser from 'phaser'

export const createChracterAnims = (anims: Phaser.Animations.AnimationManager)=>{
    const animsFrameRate = 15

    anims.create({
        key: 'basic',
        frames: [{key: 'avatar0', frame:0}],
        frameRate: 20
    })
    
    anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('avatar0', {
            start:0, end:2
        }),
        frameRate: animsFrameRate * 0.6,
        repeat: -1
    })

    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('avatar0', {
            start:3, end:5
        }),
        frameRate: animsFrameRate * 0.6,
        repeat: -1
    })
    
    anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('avatar0', {
            start:6, end:8
        }),
        frameRate: animsFrameRate * 0.6,
        repeat: -1
    })

    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('avatar0', {
            start:9, end:11
        }),
        frameRate: animsFrameRate * 0.6,
        repeat:-1
    })
}

