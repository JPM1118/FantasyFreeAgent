const transformResponseData = (resData) => {
  try {
    let editedArray = []
    //create array of object keys to itterate in existing order.
    let resArray = Object.entries(resData);
    for (const [key, value] of resArray) {
      let playerObj = {}
      if (value.hasOwnProperty('player')) {
        //Array index that contains ownership status can vary, hence variable below.
        const ownershipIdx = value.player.length - 1;

        playerObj.name = value.player[0][2].name
        playerObj.owned = value.player[ownershipIdx].ownership.ownership_type === 'team' ? true : false
        editedArray.push(playerObj);
      }
    }
    return editedArray
  } catch (e) {
    console.error(e)
  }
}

module.exports = transformResponseData
