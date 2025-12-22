export type Language = 'MN' | 'EN';

export const translations = {
  MN: {
    appTitle: 'Smart Control',
    status: {
      noConnection: 'Холболт байхгүй байна',
      connecting: 'Төхөөрөмжтэй холбогдож байна...',
      connected: 'Холболт амжилттай',
      added: 'Төхөөрөмж нэмэгдлээ',
      deviceOn: ' асаалттай',
      deviceOff: ' унтарсан',
      ready: 'Төхөөрөмжүүдийг удирдах боломжтой',
      deleted: ' устгалаа',
    },
    menu: {
      connect: 'Төхөөрөмж холболт',
      settings: 'Тохиргоо',
      about: 'Тухай',
    },
    home: {
      scanQr: 'QR унших',
    },
    settings: {
      title: 'Тохиргоо',
      fakeMode: 'Туршилт (Fake Mode)',
      language: 'Хэл',
      reconnect: 'Wi-Fi дахин холбох',
      aboutDev: 'Хөгжүүлэгчийн тухай',
      deviceInfo: 'Төхөөрөмжийн мэдээлэл',
      getDeviceInfo: 'Мэдээлэл авах',
      wifiSsid: 'Wi-Fi SSID',
      wifiPass: 'Wi-Fi Нууц үг',
      sendWifi: 'Төхөөрөмж рүү илгээх',
      changeLanguage: 'Хэл солих',
      back: 'Буцах',
    },
    about: {
      title: 'Тухай',
      description: 'Энэхүү програм нь ESP32 болон Arduino дээр суурилсан ухаалаг төхөөрөмжүүдийг удирдах зориулалттай.',
      version: 'Хувилбар 1.0.0',
    },
    dialogs: {
      rename: 'Нэр өөрчлөх',
      cancel: 'Болих',
      save: 'Хадгалах',
      delete: 'Устгах',
      confirmDelete: 'Та энэ төхөөрөмжийг устгахдаа итгэлтэй байна уу?',
    }
  },
  EN: {
    appTitle: 'Smart Control',
    status: {
      noConnection: 'No connection',
      connecting: 'Connecting to device...',
      connected: 'Connection successful',
      added: 'Device added',
      deviceOn: ' is ON',
      deviceOff: ' is OFF',
      ready: 'Ready to control devices',
      deleted: ' deleted',
    },
    menu: {
      connect: 'Device Connection',
      settings: 'Settings',
      about: 'About',
    },
    home: {
      scanQr: 'Scan QR',
    },
    settings: {
      title: 'Settings',
      fakeMode: 'Fake Mode (Demo)',
      language: 'Language',
      reconnect: 'Reconnect Wi-Fi',
      aboutDev: 'About Developer',
      deviceInfo: 'Device Info',
      getDeviceInfo: 'Get Device Info',
      wifiSsid: 'Wi-Fi SSID',
      wifiPass: 'Wi-Fi Password',
      sendWifi: 'Send to Device',
      changeLanguage: 'Change Language',
      back: 'Back',
    },
    about: {
      title: 'About',
      description: 'This application is designed to control ESP32 and Arduino based smart devices remotely.',
      version: 'Version 1.0.0',
    },
    dialogs: {
      rename: 'Rename Device',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this device?',
    }
  }
};
