const csgoTypeMap = {
  CSGO_Type_Pistol: '手枪',
  CSGO_Type_SMG: '微型冲锋枪',
  CSGO_Type_Rifle: '步枪',
  CSGO_Type_Shotgun: '霰弹枪',
  CSGO_Type_SniperRifle: '狙击步枪',
  CSGO_Type_Machinegun: '机枪',
  CSGO_Type_WeaponCase: '武器箱',
  CSGO_Type_Knife: '匕首',
  Type_Hands: '手套',
  CSGO_Type_Other: '其他'
}

const csgoTypeList = []
Object.keys(csgoTypeMap).map((key) => {
  csgoTypeList.push({
    type: key,
    name: csgoTypeMap[key]
  })
})
export default {
  csgoTypeMap,
  csgoTypeList
}
