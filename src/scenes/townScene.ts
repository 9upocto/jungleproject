import Phaser from 'phaser'


export default class townScene extends Phaser.Scene {
	
	private platforms?:Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

	constructor() {
		super('town')
	}

	preload() {
		this.load.image('town', 'assets/map/town.png')
		this.load.tilemapTiledJSON('town', 'assets/map/town.json')
		
		this.load.spritesheet('avatar0', 'assets/chracter/avatar0.png', {
			frameWidth:32, frameHeight:64
		})
	}

	create() {
		this.add.image(600, 400, 'town');

		const map = this.make.tilemap({key: 'map'})
		// const tileset = map.addTilesetImage('town', 'tile', 32, 32, 0, 0)
		// const buildingLayer = map.createLayer('building', tileset)

		// buildingLayer.setCollisionByProperty({collision: true })

		//배경 이미지를 게임 화면 크기로 확대
		const backgroundImage = this.add.image(0, 0, 'town');
        backgroundImage.setOrigin(0, 0); // 이미지의 원점을 좌상단으로 설정
        backgroundImage.setScale(this.scale.width / backgroundImage.width, this.scale.height / backgroundImage.height);

		this.platforms = this.physics.add.staticGroup()
		
		this.player = this.physics.add.sprite(480, 450, 'avatar0').setName("player");
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, buildingLayer)

		this.cursors = this.input.keyboard.createCursorKeys()
	}

	update() {
		if (!this.cursors){return}
		const speed = 2.5;
		let playerVelocity = new Phaser.Math.Vector2();

		// 방향키로 방향바꾸기
		if (this.cursors.left?.isDown){
			playerVelocity.x = -100;
			this.player?.anims.play('left', true)
		} 
		else if (this.cursors.right?.isDown){
			playerVelocity.x = 100;
			this.player?.anims.play('right', true)
		} 
		else if(this.cursors.up.isDown) {
			playerVelocity.y = -100;
			this.player?.anims.play('up',true)
		}
		else if (this.cursors.down.isDown){
			playerVelocity.y = 100
			this.player?.anims.play('down',true)
		}
		else { //방향키 안 눌렀을때
			playerVelocity.x = 0
			playerVelocity.y = 0
			this.player?.anims.play('basic')
		}

		this.player?.setVelocity(playerVelocity.x, playerVelocity.y)
	}
}
