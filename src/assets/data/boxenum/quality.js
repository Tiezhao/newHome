const qualityList = [
  {
    name: '消费级',
    value: 'Rarity_Common_Weapon',
    color: '#b0c3d9',
    textClass: 'rarity-common-weapon-color',
    bgClass: 'rarity-common-weapon-bg',
    level: 1
  },
  {
    name: '工业级',
    value: 'Rarity_Uncommon_Weapon',
    color: '#5e98d9',
    textClass: 'rarity-uncommon-weapon-color',
    bgClass: 'rarity-uncommon-weapon-bg',
    level: 2
  },
  {
    name: '军规级',
    value: 'Rarity_Rare_Weapon',
    color: '#4b69ff',
    textClass: 'rarity-rare-weapon-color',
    bgClass: 'rarity-rare-weapon-bg',
    level: 3
  },
  {
    name: '受限',
    value: 'Rarity_Mythical_Weapon',
    color: '#8847ff',
    textClass: 'rarity-mythical-weapon-color',
    bgClass: 'rarity-mythical-weapon-bg',
    level: 4
  },
  {
    name: '保密',
    value: 'Rarity_Legendary_Weapon',
    color: '#d32ce6',
    textClass: 'rarity-legendary-weapon-color',
    bgClass: 'rarity-legendary-weapon-bg',
    level: 5
  },
  {
    name: '隐秘',
    value: 'Rarity_Ancient_Weapon',
    color: '#eb4b4b',
    textClass: 'rarity-ancient-weapon-color',
    bgClass: 'rarity-ancient-weapon-bg',
    level: 6
  },
  {
    name: '违禁',
    value: 'Rarity_Contraband',
    color: '#e4ae39',
    textClass: 'rarity-contraband-color',
    bgClass: 'rarity-contraband-bg',
    level: 7
  },
  {
    name: '普通级',
    value: 'Rarity_Common',
    color: '#b0c3d9',
    textClass: 'rarity-common-color',
    bgClass: 'rarity-common-bg',
    level: 1
  },
  {
    name: '高级',
    value: 'Rarity_Rare',
    color: '#4b69ff',
    textClass: 'rarity-rare-color',
    bgClass: 'rarity-rare-bg',
    level: 3
  },
  {
    name: '卓越',
    value: 'Rarity_Mythical',
    color: '#8847ff',
    textClass: 'rarity-mythical-color',
    bgClass: 'rarity-mythical-bg',
    level: 4
  },
  {
    name: '奇异',
    value: 'Rarity_Legendary',
    color: '#d32ce6',
    textClass: 'rarity-legendary-color',
    bgClass: 'rarity-legendary-bg',
    level: 5
  },
  {
    name: '非凡',
    value: 'Rarity_Ancient',
    color: '#eb4b4b',
    textClass: 'rarity-ancient-color',
    bgClass: 'rarity-ancient-bg',
    level: 6
  }

];

const getQualityMap = (value) => {

  for (let i = 0; i < qualityList.length; i++) {
    const quality = qualityList[i];
    if (value === quality.value) {
      return quality
    }
  }
}


export { getQualityMap };
