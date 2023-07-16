import React, { useRef, useEffect } from "react";
import Phaser from "phaser";
import townScene from './townScene'

const config:Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1280,
	height: 960,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug:true,
		},
	},
	scene: [townScene],
}

export default new Phaser.Game(config)
