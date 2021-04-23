const SERVICE_UUID = 'd5875408-fa51-4763-a75d-7d33cecebc31'
const CHARACTERISTIC_UUID = 'a4f01d8c-a037-43b6-9050-1876a8c23584'

const btn = document.getElementById('btn')
const textX = document.getElementById('textX')
const textY = document.getElementById('textY')
const textZ = document.getElementById('textZ')

// Web Bluetoothはユーザーアクションをトリガーに処理を始める必要がある
btn.addEventListener('click', (event) => {
  connect()
})

const connect = () => {
  // Scan
  navigator.bluetooth.requestDevice({
    // 'Up'というデバイス名でフィルタリング
    acceptAllDevices: false,
    filters: [
      {namePrefix: 'Up'}
    ],
    optionalServices: [
      // 使用したいServiceを登録しておく
      SERVICE_UUID
    ]
  })
    // 接続
    .then(device => device.gatt.connect())
    // Service取得
    .then(server => server.getPrimaryService(SERVICE_UUID))
    // Characteristic取得
    .then(service => service.getCharacteristic(CHARACTERISTIC_UUID))
    // Notificationsを開始
    .then(characteristic => setNotifications(characteristic))
    // Errorはこちら
    .catch(error => console.log(error))
}

// Notification設定
const setNotifications = (characteristic) => {

  // Add Event
  characteristic.addEventListener('characteristicvaluechanged', (event) => {
    const value = event.target.value
    var z = new Uint8Array(value.buffer)
    // z is uint8 array、これで加速度データを正常に読める
    // 参考：https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
    console.log(z)

    // データをパース
    //const decoder = new TextDecoder('utf-8')
    //const str = decoder.decode(z[0])
    //const json = JSON.parse(str)
    // Nefry BTからのデータを表示
    if (textX) textX.innerHTML = z[0]
    if (textY) textY.innerHTML = z[1]
    if (textZ) textZ.innerHTML = z[2]
    if (stepcount) stepcount.innerHTML = z[9]
    if (textTemperature) textTemperature.innerHTML = String(z[3]) + " Celsius"
    if (textHumidity) textHumidity.innerHTML = String(z[4]) + " %"
    if (textGas) textGas.innerHTML = String(z[5]) + " kOhms"
    if (textPressure) textPressure.innerHTML = String(z[6] * 10) + " hPa"
    if (textAmbientTemp) textAmbientTemp.innerHTML = String(z[7]) + " Celsius"
    if (textObjectTemp) textObjectTemp.innerHTML = String(z[8]) + " Celsius"
  })

  // Notifications開始
  characteristic.startNotifications()
}