module.exports = {
  packagerConfig: {
    icon: 'icon',
    executableName: "shuffle-penguin"
  },
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ShimixD',
          name: 'Shuffle-Penguin-App'
        },
        prerelease: true
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://app.shufflepenguin.xyz/icon.ico',
        setupIcon: 'icon.ico',
        loadingGif: 'assets/default-splash.gif'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'icon.icns',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
