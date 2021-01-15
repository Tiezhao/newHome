const exteriorList = [
  {
    name: '崭新出厂',
    value: 'WearCategory0',
    color: '#008000'
  },
  {
    name: '略有磨损',
    value: 'WearCategory1',
    color: '#5cb85c'
  },
  {
    name: '久经沙场',
    value: 'WearCategory2',
    color: '#f0ad4e'
  },
  {
    name: '破损不堪',
    value: 'WearCategory3',
    color: '#f0ad4e'
  },
  {
    name: '战痕累累',
    value: 'WearCategory4',
    color: '#f0ad4e'
  },
  {
    name: '无涂装',
    value: 'WearCategoryNA',
    color: '#008000'
  }
]


const getExteriorMap = (value) => {

  for (let i = 0; i < exteriorList.length; i++) {
    const quality = exteriorList[i];
    if (value === quality.value) {
      return quality
    }
  }
}


export { getExteriorMap }
