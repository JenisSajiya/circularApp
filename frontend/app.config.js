//frontend/app.config.js
export default ({ config }) => ({
  ...config,

  name: "CircularApp",
  slug: "circular-app",

  extra: {
    ...config.extra,
    backendUrl: process.env.BACKEND_URL ?? "https://circular-app-dzfd.vercel.app",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000"
        }
      }
    ]
  ],

  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },

  extra: {
    router: {},
    eas: {
      projectId: "a76040fd-a158-4ea0-a56a-e656ee47f102"
    },
    backendUrl: process.env.BACKEND_URL || "https://circular-app-dzfd.vercel.app"
  }
});
