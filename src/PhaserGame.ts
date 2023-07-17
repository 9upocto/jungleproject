import React, { useRef, useEffect } from "react";
import Phaser from "phaser";
// import Loading from './scenes/Loading'
import townScene from './scenes/townScene'

const config:Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1280,
	height: 960,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug:true,
		},
	},
	autoFocus: true,
	scene: [townScene],
}

export default new Phaser.Game(config)
