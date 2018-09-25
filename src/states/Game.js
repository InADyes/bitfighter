/* globals __DEV__ */
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Player2d from '../sprites/2dPlayer';

export default class extends Phaser.State {
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
    const _player = new Player2d({
      game: this.game,
      x:
        position === 'left'
          ? this.world.centerX - this.world.width / 5
          : this.world.centerX + this.world.width / 5,
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

    if (params.length === 3) {
      console.log('old fight', params);
      return this.loadMatchFromAPI();
    }

    const socket = io('https://staging-cofnode.operaevent.co/');
    window.socket = socket;

    socket.on('connect', function() {
      console.log('connected');
      const influencer_id = params[0].split('=')[1];
      const access_token = params[1].split('=')[1];

      socket.emit('joininfluencer', {
        influencer_id,
        access_token
      });
    });

    socket.on('current-champs', data => {
      console.log('current-champs', data);
      if (Array.isArray(data) && data.length > 0) {
        if (
          Array.isArray(this.activePlayers) &&
          this.activePlayers.length > 0
        ) {
          this.clearActivePlayers();
        }
        for (let player of data) {
          player.currentHp = player.hp;
          this.addPlayer(
            player.character_type,
            player,
            null,
            player.team === 0 ? 'left' : 'right'
          );
        }
      }
    });

    socket.on('live-fight', data => {
      console.log('live-fight', data);
      this.parseFight(data);
    });
    socket.on('joininfluencer-fail', function(data) {
      console.log('joininfluencer-fail', data);
    });

    socket.on('disconnect', function(data) {
      console.log('disconnect', data);
    });
  }

  clearActivePlayers() {
    for (const player of this.activePlayers) {
      player.quickKill();
      player.kill();
      this.activePlayers.slice();
    }
    this.activePlayers = [];
  }

  parseFight(data) {
    if (Array.isArray(data)) {
      let baseStartTime = new Date();
      for (const round of data) {
        if (round.action === 'arrange-players') {
          baseStartTime = round.time;
        }
        const timeout = setTimeout(async () => {
          if (round.action === 'arrange-players') {
            await this.clearActivePlayers();
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
            this.parseRound(round);
          }
          this.activeTimeouts.pop();
        }, Date.parse(round.time) - Date.parse(baseStartTime));
        this.activeTimeouts.push(timeout);
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
      case 'healed':
        this.activePlayers[round.player].goHeal(round.meta.amount);
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
        const victor = this.activePlayers[round.player];
        victor.quickKill();
        victor.kill();
        this.clearActivePlayers();
        this.addPlayer(victor.asset, victor.playerInfo, null, 'left');
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
      txtToDisplay,
      {
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

  loadMatchFromAPI() {
    const params = window.location.search.replace('?', '').split('&');
    const oldFight = params[2].split('=')[1];
    const access_token = params[1].split('=')[1];
    $.ajax({
      url: `https://staging-cofnode.operaevent.co/getfight/${oldFight}`,
      method: 'GET',
      dataType: 'json',
      crossDomain: true,
      contentType: 'application/json; charset=utf-8',
      cache: false,
      beforeSend: function(xhr) {
        /* Authorization header */
        xhr.setRequestHeader('Authorization', access_token);
      },
      success: data => {
        console.log('### Playing Pregenerated Match ###');
        if (data && data.reel) {
          this.parseFight(data.reel);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Match', textStatus);
      }
    });
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
      beforeSend: function(xhr) {
        /* Authorization header */
        xhr.setRequestHeader('Authorization', access_token);
      },
      success: data => {
        console.log('### Playing Pregenerated Match ###');
        this.playRecordedMatch(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Random Match', textStatus);
      }
    });
  }
}
