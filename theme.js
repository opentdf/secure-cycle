import { extendTheme } from 'native-base';

const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#d1a3aa',
        100: '#c28b93',
      },
      secureCycle: {
        primary: '#c28b93',
        pink: '#BA8D93',
        primaryLight: '#d1a3aa',
        dark: '#6B596F',
        secondary: "#BA9D8D",
        tertiary: "#84A5A3",
        tertiaryLight: "#b0c7c5",
        light: "#EAE4E5",
        muted: "#DCD3D1",
        white: "#FFF"
      },
      secondary: {
        50: '#846c8a',
        100: '#6B596F',
      },
      tertiary: {
        50: '#b0c7c5',
        100: '#84A5A3',
      },
      light: {
        50: '#efe5e3',
        100: '#DCD3D1',
      },
      muted: {
        50: '#BA9D8D',
        100: '#BA9D8D',
      }
    },
    components: {
      Button: {
        variants: {
              bg: `secureCycle.primary`,
          }
        }
      }
    // fontConfig: {},
    // fonts: {},
    // config: {
    //   initialColorMode: 'dark',
    // },
  });

  export default theme;