/* globals __DEV__ */
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Player2d from '../sprites/2dPlayer';

export default class extends Phaser.State {
  activePlayers;
  activeTimeouts;
  init() {
    this.stage.disableVisibilityChange = true;
    this.activePlayers = [];
    this.activeTimeouts = [];
    this.socketInit();
  }
  preload() {}

  create() {
    // this.loadRandomMatchFromAPI();
    // this.loadFakeData();
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
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  addPlayer(asset, player, stats, position) {
    console.log(player);
    const _player = new Player2d({
      game: this.game,
      x: position === 'left' ?
        this.world.centerX - this.world.width / 5 : this.world.centerX + this.world.width / 5,
      y: this.world.centerY,
      asset: asset,
      position: position,
      player: player,
      stats: stats
    });
    this.activePlayers.push(_player);
  }

  socketInit() {
    if (window.location.search === '') {
      return console.error('No Params. Influencer ID and Token required');
    }
    const params = window.location.search.replace('?', '').split('&');

    const socket = io('https://staging-cofnode.operaevent.co/');
    window.socket = socket;

    socket.on('connect', function () {
      console.log('connected');
      const influencer_id = params[0].split('=')[1];
      const access_token = params[1].split('=')[1];

      socket.emit('joininfluencer', {
        influencer_id,
        access_token
      });
    });

    socket.on('current-champs', (data) => {
      console.log('current-champs', data);
      if (Array.isArray(data) && data.length > 0) {
        if (Array.isArray(this.activePlayers) && this.activePlayers.length > 0) {
          this.clearActivePlayers();
        }
        for (const player of data) {

          this.addPlayer(
            player.character_type,
            player,
            null,
            player.team === 0 ? 'left' : 'right'
          );
        }
      }
    });

    socket.on('live-fight', function (data) {
      console.log('live-fight', data);
      if (Array.isArray(data)) {
        const baseStartTime = new Date();
        for (const round of data) {
          this.activeTimeouts.push(setTimeout(() => {
            if (round.action === 'arrange-players') {
              baseStartTime = round.time;
              this.clearActivePlayers();
              for (const player of round.meta.players) {

                this.addPlayer(
                  player.class.name,
                  player,
                  null,
                  player.team === 0 ? 'left' : 'right'
                );
              }
            } else {
              this.parseRound(round);
            }
            this.activeTimeouts.pop();
          }, Date.parse(round.time) - Date.parse(baseStartTime)));
        }
      }

    });
    socket.on('joininfluencer-fail', function (data) {
      console.log('joininfluencer-fail', data);
    });

    socket.on('event', function (data) {
      incomingEvent(data);
    });

    socket.on('disconnect', function (data) {
      console.log('disconnect', data);
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

  clearActivePlayers() {
    for (const player of this.activePlayers) {
      player.quickKill();
      player.kill();
      this.activePlayers.slice()
    }
    this.activePlayers = [];
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
          this.parseRound(round);
        }, Date.parse(round.time) - Date.parse(baseStartTime));
      }
    }
  }

  parseRound(round) {
    switch (round.action) {
      case 'attack':
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
        this.activePlayers[round.player].goVictory();
        // this.addText('Victory!', 3000, 'green');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
        break;
      case 'buff-apply':
        this.activePlayers[round.player].goAddBuff(round, true);
        break;
      case 'buff-remove':
        this.activePlayers[round.player].goRemoveBuff(round, false);
        break;
      default:
        break;
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
      this.game.world.centerY - this.game.world.centerY / 5,
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

  loadRandomMatchFromAPI() {
    if (window.location.search === '') {
      return console.error('Params required');
    }
    const params = window.location.search.replace('?', '').split('&');
    const influencer_id = params[0].split('=')[1];
    const access_token = params[1].split('=')[1];
    $.ajax({
      url: `https://staging-cofnode.operaevent.co/random-match/${influencer_id}`,
      method: 'GET',
      dataType: 'json',
      crossDomain: true,
      contentType: 'application/json; charset=utf-8',
      cache: false,
      beforeSend: function (xhr) {
        /* Authorization header */
        xhr.setRequestHeader('Authorization', access_token);
      },
      success: data => {
        console.log('### Playing Pregenerated Match ###');
        this.playRecordedMatch(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Random Match', textStatus);
      }
    });
  }
}