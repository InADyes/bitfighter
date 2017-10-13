import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import { rarities } from '../shared/characterPicker';

export class CardChoices {
    private cards: HTMLDivElement[];
    private timeout: number | null = null;

    constructor (
        private readonly cardDiv: HTMLDivElement,
        private readonly artURLs: string[],
        private readonly emitGameEvent: (message: FrontToBackMessage) => void,
        private readonly cardsTimeout: number
    ){}

    public displayCards(cards: HTMLDivElement[]) {
        if (this.timeout) {
            this.clearCards();
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.cards = cards;
        for (let i = 0; i < this.cards.length; i++) {
            this.cardDiv.appendChild(this.cards[i]);
            this.cards[i].addEventListener('click', () => {
                this.emitGameEvent({
                    characterChoice: {
                        choice: i
                }});
                this.clearCards();
            });
        }
        this.timeout = window.setTimeout(
            () => this.clearCards(),
            this.cardsTimeout // one minute
        );
    }
    private clearCards() {
        for (let card of this.cards) {
            this.cardDiv.removeChild(card);
        }
        this.cards = [];
    }
}

export function updateStatusCards(
    cards: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
        profileImageURL: string;
        bossMessage: string;
        card: CharacterCard;
    }[],
    artURLS: string[]
) {
    const newCard1 = cards[0] ? buildCard(cards[0].card, artURLS) : null;
    const newCard2 = cards[1] ? buildCard(cards[1].card, artURLS) : null;
    const oldCard1 = document.getElementById('card1');
    const oldCard2 = document.getElementById('card2');
    if (oldCard1 && newCard1) {

        oldCard1.classList.remove("empty-card");
        oldCard1.classList.add("card");
        oldCard1.innerHTML = newCard1.innerHTML;
    }
    else if (oldCard1) {
        oldCard1.classList.remove("card");
        oldCard1.classList.add("empty-card");
    }
    if (oldCard2 && newCard2) {
        oldCard2.classList.remove("empty-card");
        oldCard2.classList.add("card");
        oldCard2.innerHTML = newCard2.innerHTML;
    }
    else if (oldCard2) {
        oldCard2.classList.remove("card");
        oldCard2.classList.add("empty-card");
        oldCard2.innerHTML = "";
    }
}

export function buildCard(character: CharacterCard, artURLs: string[]) {
    let card = document.createElement('div');
    let info = JSON.stringify(character);
    
    let usedBBBCheermote = false;
    
    //If this character is bitboss cheermote only apply the appropriate class
    if(character.bitBossCheerMote){
      card.className = 'character_select_card csc_bbbonly';
    }else{
      card.className = 'character_select_card';
    }
    
    //We are going to include this disabled element when the card is bitboss cheermote only and they didn't use the bitboss cheermote
    let disabled_overlay = document.createElement('div');
    disabled_overlay.className = 'csc_disabledwrap';
    disabled_overlay.innerHTML = `
    <div class="csc_bbb_disabled"> 
      <img src="https://s3.amazonaws.com/operaevent-gather/locked.png" /><br/>
      This card is only available when using the bitboss cheermote
    </div>`;
    
    //TODO:: Verify that I should just be using selectable true/false to know whether the user has used the bitboss cheermote
    //If it should be disabled then append the disabled overlay
    if(!character.selectable){
      card.appendChild(disabled_overlay);
    }
    
    let inside = document.createElement('div');
    inside.className = 'csc_inner';
    card.appendChild(inside);
    
    //Create all the rows for stats
    let charStats = Object.keys(character.stats).map(function(key, index){
        
        let x = `
        <tr>
          <td>${key}</td>
          <td>${ character.stats[key] }</td>
          <td>
            <div class="csc_bar">
              <div class="csc_inner_bar" style="width:${ character.stats[key] }0%"></div>
            </div>
          </td>
        </tr>
        `
        return x;
    }) 

    inside.innerHTML = `
    <h3 class="csc_raritycolor${character.rarity}">${character.className}</h3>
    <div class="csc_image" style="background-image:url('${artURLs[character.art]}')">
      <div class="csc_bbb_badge">
        <img src="https://s3.amazonaws.com/operaevent-gather/tier_10000.gif" />
        <p>BitBoss<br/>Cheermote<br/>Exclusive</p>
      </div>
      <div class="csc_hoverwrap">
        <div class="csc_description">${ character.flavorText }</div>
      </div>
    </div>
    <div class="csc_left">
    
      <div class="csc_skill">
        <h4 class="csc_raritycolor${character.rarity}">${ character.buffName }</h4>
        <p><img src="https://s3.amazonaws.com/operaevent-gather/${ character.buffArt }" /> ${ character.skillText }</p>
        <div class="csc_clear"></div>
      </div>
      
      <div class="csc_rarity">
        <h4 class="csc_raritycolor${character.rarity}">${ rarities[character.rarity].name }</h4>
      </div>
    </div>
    <div class="csc_stats">
      <table>
        <tr class="csc_bonus_health">
          <td>Bonus</td>
          <td colspan="2">${ character.bonusHealth }</td>
        </tr>
        <tr>
          <td>Health</td>
          <td colspan="2">${ character.baseHealth }</td>
        </tr>
        ${charStats.join(' ')}
        <tr>
          <td>Level</td>
          <td>${ character.level }</td>
          <td>
            <div class="csc_bar">
              <div class="csc_inner_bar" style="width:${ character.level }0%"></div>
            </div>
          </td>
        </tr>
      </table>
    </div>`;

    return card;
}

function healthBarSVG(amount: {
    amount: number;
    factor: number;
}) {
    return `
    <svg class="stat-svg" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 50">
        <defs>
        <mask id="healthBarCutout">
            <rect x="144.72" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="130.25" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="115.77" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="101.3" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="86.83" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="72.36" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="57.89" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="43.42" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="28.94" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="14.47" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="0" y="5" width="8" height="40" rx="2" ry="2"/>
        </mask>
        </defs>
        <rect class="main" width="${ amount.amount * amount.factor }%" height="100%" mask="url(#healthBarCutout)"/>
    </svg>`;
}

