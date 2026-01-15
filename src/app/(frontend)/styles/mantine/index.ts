import { DEFAULT_THEME, mergeMantineTheme, rem } from '@mantine/core'

import { fonts } from './fonts'
import { colors } from './colors'

const mantineTheme = mergeMantineTheme(
  DEFAULT_THEME,

  {
    ...fonts,
    ...colors,
    components: {
      Container: {
        defaultProps: {
          size: rem(1200),
        },
      },
      Modal: {
        styles: {
          title: {
            fontWeight: 600,
          },
        },
      },
      DatePicker: {
        defaultProps: {
          withCellSpacing: false,
        },
      },
      Switch: {
        defaultProps: {
          withThumbIndicator: false,
        },
      },
      TextInput: {
        defaultProps: {
          size: 'md',
          labelProps: {
            fw: 400,
          },
        },
      },
      InputLabel: {
        defaultProps: {
          size: 'md',
          fz: 'md',
          fw: 400,
        },
      },
      CloseButton: {
        defaultProps: {
          size: rem(45),
        },
      },
    },
  }
)

export { mantineTheme }
export const theme = mantineTheme
export default mantineTheme
