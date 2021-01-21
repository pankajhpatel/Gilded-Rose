const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASSES_TO_A_TAFKAL80ETC_CONCERT = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS_HAND_OF_RAGNAROS = 'Sulfuras, Hand of Ragnaros';
const CONJURED = 'Conjured Mana Cake';

function ciEquals(a, b) {
  return typeof a === 'string' && typeof b === 'string'
      ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
      : a === b;
}

class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      //if the Items is not Aged_Brie or Backstage passes to a TAFKAL80ETC concert
      if ((!ciEquals(this.items[i].name,AGED_BRIE)) && (!ciEquals(this.items[i].name,BACKSTAGE_PASSES_TO_A_TAFKAL80ETC_CONCERT))){
        if (this.items[i].quality > 0) {
          if (!ciEquals(this.items[i].name,SULFURAS_HAND_OF_RAGNAROS)) {
            //"Conjured" items degrade in Quality twice as fast as normal items
            if (ciEquals(this.items[i].name, CONJURED))
              this.items[i].quality = this.items[i].quality - 2;
            else
              this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        // "Aged Brie" actually increases in Quality the older it gets
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
          //"Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
          //quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
          //Quality drops to 0 after the concert
          if (ciEquals(this.items[i].name,BACKSTAGE_PASSES_TO_A_TAFKAL80ETC_CONCERT)){
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 2;
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 3;
              }
            }
          }
        }
      }

      // "Sulfuras", being a legendary item, never has to be sold or decreases in Quality 
      //* All items has sellIn days decrease by one at the end of day except SULFURAS_HAND_OF_RAGNAROS */
      if (!ciEquals(this.items[i].name,SULFURAS_HAND_OF_RAGNAROS)) {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      // Once the sell by date has passed, Quality degrades twice as fast
      if (this.items[i].sellIn < 0) {
        if (!ciEquals(this.items[i].name,AGED_BRIE)) {
          if (!ciEquals(this.items[i].name,BACKSTAGE_PASSES_TO_A_TAFKAL80ETC_CONCERT)) {
            if (this.items[i].quality > 0) {
              if (!ciEquals(this.items[i].name,SULFURAS_HAND_OF_RAGNAROS)){
                this.items[i].quality = this.items[i].quality - 2;
              }
            }
          } else {
            //but BACKSTAGE_PASSES_TO_A_TAFKAL80ETC_CONCERT	Quality drops to 0 after the concert
            this.items[i].quality = this.items[i].quality - this.items[i].quality;
          }
        } else {
          //"Aged Brie" actually increases in Quality the older it gets
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
    }//end of for loop
    return this.items;
  }
}

module.exports = {
  Item,
  Shop
}
