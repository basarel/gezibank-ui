import { Image } from '@mantine/core'

type IProps = {
  airlineCode: string
  width?: number
  height?: number
  alt?: string
}

const AirlineLogo: React.FC<IProps> = ({
  airlineCode,
  width = 32,
  height = 32,
  alt = airlineCode,
}) => {
  return (
    <Image
      src={`https://paraflystatic.mncdn.com/a/airlines/${airlineCode.toLocaleUpperCase()}.png`}
      alt={alt}
      w={width}
      h={height}
    />
  )
}

export { AirlineLogo }
