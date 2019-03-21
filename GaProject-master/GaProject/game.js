//Phaser inställningar
//all kod är skriven av Tim Martinsson aka timce2, progressbaren tog jag hjälp med av en tutorial som inte tilhörde phaser.
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 },
			setBounds: {
                x: 0,
                y: 0,
                width: 3200,
                height: 600,
                thickness: 32
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
		update: update
    }
};

//bara ett medelande till konsolen så jag enklare kan se vart det gick fel
console.log("Phaser settings loaded fine");

//här är de flesta av mina variablar
var player;
var platforms;
var music;
var points = 0;
var pointText;
var coins;
var slime;
var grassBox;
var spikes;
var flag;
var info = alert("Hello you can use the arrow keys to move and jump, also the longer you take and the more you die the harder the game becomes to complete it. If the game becomes too hard press F5 or refresh the page manualy to reset thank you for playing! - Tim");
var gameOver = false;

new Phaser.Game(config);

//laddar in saker innan scenen skapas
function preload ()
{
	//Skapar en progressbar till spelet (progressbaren skapades med hjälp av en tutorial)

	//skapar progressBar och Box och lägger till grafik
     var progressBar = this.add.graphics();
	 var progressBox = this.add.graphics();
	 
	 //lägger in färg och skapar en rektrangel med den
	 progressBox.fillStyle(0x222222, 0.8);
     progressBox.fillRect(240, 270, 320, 50);
	 
	 //ställer in höjd och bredd på kameran och skapar loading texten
     var width = this.cameras.main.width;
     var height = this.cameras.main.height;
     var loadingText = this.make.text({
     x: width / 2,
     y: height / 2 - 50,
     text: 'Loading...',
     style: {
     font: '20px monospace',
     fill: '#ff0000'
                }
	 });
	 //lägger till loading text		
     loadingText.setOrigin(0.5, 0.5);
	 
	 //skapar procent texten
     var percentText = this.make.text({
     x: width / 2,
     y: height / 2 - 5,
     text: '0%',
     style: {
     font: '18px monospace',
     fill: '#00ff00'
                }
	 });

	 //lägger till procent texten		
     percentText.setOrigin(0.5, 0.5);
	 
	 
     var assetText = this.make.text({
     x: width / 2,
     y: height / 2 + 50,
     text: '',
     style: {
     font: '18px monospace',
     fill: '#ff0000'
                }
     });

     assetText.setOrigin(0.5, 0.5);
            
     this.load.on('progress', function (value) {
     percentText.setText(parseInt(value * 100) + '%');
     progressBar.clear();
     progressBar.fillStyle(0xffffff, 1);
     progressBar.fillRect(250, 280, 300 * value, 30);
     });
            
    this.load.on('fileprogress', function (file) {
    assetText.setText('Loading asset: ' + file.key);
    });

	//tar bort allt från skärmen så att personen ska slippa att titta på 100% i resten av sina liv
     this.load.on('complete', function () {
     progressBar.destroy();
     progressBox.destroy();
     loadingText.destroy();
     percentText.destroy();
     assetText.destroy();
     }); 


	//laddar in all bilder och sprites till spelet
	// this.load.image('player', 'assets/guy.png');
	 this.load.spritesheet('player', 'assets/playerWalk.png', { frameWidth: 32, frameHeight: 32});
	 this.load.image('sky', 'assets/sky.png');
	 this.load.image('ground', 'assets/longGround.png');
	 this.load.image('platform', 'assets/platform.png');
	 this.load.image('coin','assets/coin.png');
	 this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 32});
	 this.load.image('grassBox', 'assets/grassBox.png');
	 this.load.image('spikes', 'assets/spikes.png');
	 this.load.image('flag', 'assets/flag.png');
	 this.load.image('spikeball', 'assets/spikeball.png');
	 //this.load.image('wall', 'assets/wall.png'); //fungerar inte av någon anledning!?!? och förstör spelets reload why tho?!?
	 this.load.audio('music1', 'assets/music1.mp3');
	 
	 this.load.image('Materials', 'assets/Materials.png');
	 this.load.tilemapTiledJSON('map', 'assets/map.json');
	 
	 info;

	 //bara ett medelande till konsolen så jag enklare kan se vart det gick fel
	 console.log("preloader loaded fine");
};

	//skapar allt i canvasen
	function create ()
	{
	//lägger in tilemap
	var map = this.make.tilemap({ key: 'map' });
	
	//lägger till ett tileset
	var tileset = map.addTilesetImage('Materials');
	
	//gör mappen grafisk och interaktable men detta funkar inte för tillfället
	//var layer = map.createStaticLayer(0, ground, 0, 0);
	
	
	// skapar himlen
	this.add.image(400,300, 'sky');
	this.add.image(1200,300, 'sky');
	this.add.image(2000,300, 'sky');
	this.add.image(2800,300, 'sky');
	this.add.image(3600,300, 'sky');
	
	/* Musiken har ett bugg som gör att det är jobbigt att ha den på så den är tas bort för tillfället 
	var music = this.sound.add('music1');
	music.play();
	*/

	//gör en statisk grupp med fysik till "platforms"
	platforms = this.physics.add.staticGroup();
	
	//Skapar en stor platform som är spelets mark
	platforms.create(400, 550, 'ground');
	platforms.create(1200, 550, 'ground');
	platforms.create(2000, 550, 'ground');
	platforms.create(2800, 550, 'ground');
	platforms.create(3600, 550, 'ground');
	
	//Skapar två platformar
	platforms.create(100, 400, 'platform');
	platforms.create(500, 300, 'platform');

	//skapar en statisk grupp med fysik till "grassBox"
	grassBox = this.physics.add.staticGroup();

	grassBox.create(1000, 488,'grassBox');
	grassBox.create(1224, 488, 'grassBox');

	//skapar en statisk grupp med fysik till "spikes"
	spikes = this.physics.add.staticGroup();

	//första "spike rown" i spelet
	spikes.create(1032, 484, 'spikes');
	spikes.create(1064, 484, 'spikes');
	spikes.create(1096, 484, 'spikes');
	spikes.create(1128, 484, 'spikes');
	spikes.create(1160, 484, 'spikes');
	spikes.create(1192, 484, 'spikes');

	//första "Spike rown" i spelet efter andra lådan
	spikes.create(1254, 484, 'spikes');
	spikes.create(1286, 484, 'spikes');
	spikes.create(1318, 484, 'spikes');
	spikes.create(1350, 484, 'spikes');
	spikes.create(1382, 484, 'spikes');
	spikes.create(1414, 484, 'spikes');
	
	//skapar min flag
	flag = this.physics.add.staticGroup();
	flag.create(3600, 468, 'flag');

	//lägger in texten som säger hur många poäng jag har
	pointText = this.add.text(2, 2, 'points: ' + points, {fontSize: '32px', fill: '#000'});
	
	//Lägger till en ny grup som heter "coins" den ska ha fysik men vara "Static"
	coins = this.physics.add.staticGroup();
	coins.create(400, 450, 'coin');
	coins.create(1110, 390, 'coin');
	coins.create(700, 450, 'coin');
	
	//skapar spelaren och lägger till fysik 
	player = this.physics.add.sprite(100, 350, 'player');
	player.body.setSize(10, 32, 50, 25);
	
	//gör så att spelaren kommer studsa på emot andra pysiska grupper
    player.setBounce(0.2);
	
    //blockar spelaren från att gå "out of bounds"
	player.setCollideWorldBounds(true);
	player.smoothed = false;
	
	//lägger till "Slime"
	slime = this.physics.add.sprite(470,265, 'slime');

	slimes = this.physics.add.group();
	
	
	
	//gör så att spelaren koliderar med platformarna med andra ord spelaren kan inte trilla igenom dom 
	//och likt spelaren så är det andra grupper som samma sak händer med nedanför
	this.physics.add.overlap(player, slime, death, null, this);
	this.physics.add.overlap(player, slimes, death, null, this);
	this.physics.add.overlap(player, coins, collectCoins, null, this);
	this.physics.add.overlap(player, spikes, death, null, this);
	this.physics.add.overlap(player, flag, win, null, this);

	this.physics.add.collider(player, platforms);
	this.physics.add.collider(coins, platforms);
	this.physics.add.collider(slime, platforms);
	this.physics.add.collider(slimes, platforms);

	this.physics.add.collider(player, slime);
	this.physics.add.collider(player, slimes);
	this.physics.add.collider(player, spikes);
	this.physics.add.collider(player, grassBox);
	this.physics.add.collider(player, flag);
	
	 //skapar en animation "left"
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

	//skapar en animation "idle"
    this.anims.create({
        key: 'idle',
        frames: [ { key: 'player', frame: 6 } ],
        frameRate: 20
    });
	
	//skapar en animation "right"
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 12 }),
        frameRate: 10,
        repeat: -1
    });
	
	this.anims.create({
        key: 'slimeAni',
        frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
	
	//lägger till tangentbords nyklar
	cursors = this.input.keyboard.createCursorKeys();
	
	//Olika kamera inställningar
	this.cameras.main.setSize(800, 600);
	this.cameras.main.setBounds(0, 0, 4000, 600);
    this.physics.world.setBounds(0, 0, 4000, 600);
	this.cameras.main.startFollow(player);
	this.cameras.main.setZoom(1.2);
	this.cameras.main.roundPixels = false;
	//här lägger jag till en extra kamera för att kunna se mina poäng
	this.cameras.add(0, 0, 210, 35);
	
	var combo = this.input.keyboard.createCombo('krm', {resetOnMatch: true});
	
	//detta är en fusk kod
	this.input.keyboard.on('keycombomatch', function (event) 
	{
	
	//lägger på 50 points
	points += 50;

	Espawner();
	
	//updaterar min points text
	pointText.setText('points: ' + points);
	
	//ett console medelande så jag kan se att det funkar
	console.log('I see you found a cheat code');
	
	});

	//skapar en timer som kör Espawner funktionen
	setInterval(Espawner, 3000);

	//bara ett medelande till konsolen så jag enklare kan se vart det gick fel
	console.log("function create loaded fine");
};


	function update(time, delta) 
	{   

	//om "gameOver" är sant så slutar funktionen 
	if (gameOver)
	{
		this.scene.restart();
		return(gameOver=false, points = 0);
	};

	//setTimeout(Espawner, 3000);
	//window.setTimeout(Espawner, 3000);

	
	//sätter fart på slime
	slime.body.velocity.x = -130;
	slime.anims.play('slimeAni', true);
	
	//om slime x position är mindre än 10 så respawnar den
	if (slime.x < 10)
	{
	slime.x = 1500;
	//slime.x = 0 +  Phaser.Math.RND.between(20, 1500);
	};
	
	//sätter fart på spelaren om "Left" är nertryckt och spelar animationen "left" 
	if(cursors.left.isDown)
	{
		player.body.velocity.x = -190;
		
		player.anims.play('left', true);
	}
	
	//sätter fart på spelaren om "Right" är nertryckt och spelar animationen "right"
	else if(cursors.right.isDown)
	{
		player.body.velocity.x = 190;
		
		player.anims.play('right', true);
	}
	
	//om ingen tangent är ner tryckt så blir X hastigheten 0 och animationen blir "idle"
	else
	{
	player.body.velocity.x = 0;	
	
	player.anims.play('idle');
	}
	
	//sätter fart på spelaren om "Up" är nertryckt
	if(cursors.up.isDown && player.body.touching.down)
	{
		player.body.velocity.y = -190;
	}
	
	
};

	//collectCoins funktionen plockar bort "coin" ger 1 poäng updaterar pointText och skriver ett consol medelande
	function collectCoins (player, coins)
{

	coins.disableBody(true, true);
	points += 1;
	
	pointText.setText('points: ' + points);
	console.log("You have picked up a coin");
};

function Espawner ()
{
		//skapar mina spikeballs skulle varit Electric slime men jag har några tekniska problem atm
		var slimeSp = slimes.create(0 + Phaser.Math.RND.between(20, 1500), 16, 'spikeball');
        slimeSp.setBounce(1);
        slimeSp.setCollideWorldBounds(true);
		slimeSp.setVelocity(Phaser.Math.Between(-200, 200), 20);
		
		console.log("A spikeball has spawned")
};

function win (player)
{
	this.physics.pause();

	player.anims.play('idle');

	alert("congratulations you have won! you managed to get " + points + " points!");

	console.log("You win!");

	gameOver = true;
};

	//death funktion gör spelare röd spelar idle animationen och sätter gameOver till sant
	function death (player)
{
    this.physics.pause();

	player.anims.play('idle');

    player.setTint(0xff0000);

	//reeeeeeeeeee varför funkar inte du längre ijoefsadhaeffeioaj
    gameOver = true;
};
