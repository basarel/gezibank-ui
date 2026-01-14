import {
  DEFAULT_THEME,
  mergeMantineTheme,
  Modal,
  rem,
  TextInput,
  Input,
  CloseButton,
} from '@mantine/core'

import { fonts } from './fonts'
import { colors } from './colors'
import { DatePicker } from '@mantine/dates'

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
      Modal: Modal.extend({
        styles: {
          title: {
            fontWeight: 600,
          },
        },
      }),
      DatePicker: DatePicker.extend({
        defaultProps: {
          withCellSpacing: false,
        },
      }),
      Switch: {
        defaultProps: {
          withThumbIndicator: false,
        },
      },
      TextInput: TextInput.extend({
        defaultProps: {
          size: 'md',
          labelProps: {
            fw: 400,
          },
        },
      }),
      InputLabel: Input.Label.extend({
        defaultProps: {
          size: 'md',
          fz: 'md',
          fw: 400,
        },
      }),
      CloseButton: CloseButton.extend({
        defaultProps: {
          size: rem(45),
        },
      }),
    },
  }
)

export { mantineTheme }
export const theme = mantineTheme
export default mantineTheme
