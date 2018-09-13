/* globals __DEV__ */
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Player2d from '../sprites/2dPlayer';

export default class extends Phaser.State {
  init() {
    this.stage.disableVisibilityChange = true;
    this.socketInit();
    this.activePlayers = [];
  }
  preload() {}

  create() {
    this.loadRandomMatchFromAPI();
    this.loadFakeData();
    this.characters = [
      'cyclop-1',
      'cyclop-2',
      'cyclop-3',
      'golem-1',
      'golem-2',
      'golem-3',
      'necromancer-1',
      'necromancer-2',
      'necromancer-3'
    ];

    /* this.addPlayer(
      characters[Math.floor(Math.random() * characters.length)],
      null,
      null,
      "right"
    );
    this.addPlayer(
      characters[Math.floor(Math.random() * characters.length)],
      null,
      null,
      "left"
    ); */
    /* setTimeout(() => {
      location.reload();
    }, 15000); */
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  addPlayer(asset, player, stats, position) {
    const _player = new Player2d({
      game: this.game,
      x: position === 'left' ?
        this.world.centerX - 150 : this.world.centerX + 150,
      y: this.world.centerY,
      asset: asset,
      position: position,
      player: player,
      stats: stats
    });
    this.activePlayers.push(_player);
  }

  socketInit() {
    const socket = io('https://staging-cofnode.operaevent.co/');
    window.socket = socket;

    socket.on('connect', function () {
      console.log('connected');
    });

    socket.on('event', function (data) {
      incomingEvent(data);
    });

    socket.on('disconnect', function () {
      console.log('disconnect');
    });

    function incomingEvent(data) {
      const action = data.action;
      const actionData = data.data;
      switch (action) {
        case 'ArrangePlayers':
          console.log('arrange players', actionData);
          break;
        case 'Attack':
          console.log('attack', actionData);
          break;
        default:
          break;
      }
    }
  }

  playRecordedMatch(data) {
    if (!Array.isArray(data)) {
      return;
    }

    let baseStartTime = null;

    for (const round of data) {
      if (round.action === 'arrange-players') {
        baseStartTime = round.time;

        for (const player of round.meta.players) {
          this.addPlayer(
            player.class.name,
            player,
            null,
            player.team === 0 ? 'left' : 'right'
          );
        }
        this.startFightCountdownTxt();
      } else {
        setTimeout(() => {
          switch (round.action) {
            case 'attack':
              console.log(
                round.player,
                round.action,
                round.meta.new_initiative,
                Date.parse(round.time)
              );
              this.activePlayers[round.player].goAttack();
              break;
            case 'hit':
              this.activePlayers[round.player].goHurt(round.meta.amount);
              break;
            case 'die':
              // this.activePlayers[round.player].goDie()
              break;
            case 'dodge':
              this.activePlayers[round.player].goDodge();
              break;
            case 'victory':
              this.activePlayers[round.player].goIdle();
              this.addText('Victory!', 3000, 'green');
              setTimeout(() => {
                window.location.reload();
              }, 5000);
              break;
            case 'buff-apply':
              this.activePlayers[round.player].goAddBuff(
                round,
                true,
              );
              break;
            case 'buff-remove':
              this.activePlayers[round.player].goRemoveBuff(round, false);
              break;
            default:
              break;
          }
        }, Date.parse(round.time) - Date.parse(baseStartTime));
      }
    }
  }

  startFightCountdownTxt() {
    this.addText('3', 1000);
    setTimeout(() => {
      this.addText('2', 1000);
    }, 1000);
    setTimeout(() => {
      this.addText('1', 1000);
    }, 2000);
    setTimeout(() => {
      this.addText('Fight', 1000, 'green');
    }, 3000);
  }
  addText(txtToDisplay, timeToDisplay = 3000, textColor = 'white') {
    const txt = this.game.add.text(
      0,
      30,
      txtToDisplay, {
        font: '46px Luckiest Guy',
        fill: textColor,
        smoothed: false
      }
    );
    txt.x = this.game.world.centerX - txt.width / 2;
    this.game.add.existing(txt);
    setTimeout(() => {
      txt.destroy();
    }, timeToDisplay);
  }

  loadFakeData() {
    const oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    const rand = Math.floor(Math.random() * 2) + 1;
    oReq.open('get', `assets/test.json`, true);
    oReq.send();

    const play = data => {
      this.playRecordedMatch(data);
    };

    function reqListener(e) {
      play(JSON.parse(this.responseText));
    }
  }

  loadRandomMatchFromAPI() {
    $.post(
      'https://staging-cofnode.operaevent.co/start-match/5907b6d90b4f524ca6a4fe28',
      function (data) {
        console.log('data', data);
      }
    );
  }
}