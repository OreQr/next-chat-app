import BoringAvatar, { AvatarProps } from "boring-avatars"

const palette = ["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#587291"]

type Props = Omit<AvatarProps, "colors">

export default function Avatar({ variant = "beam", name, ...props }: Props) {
  return (
    <BoringAvatar colors={palette} variant={variant} name={name} {...props} />
  )
}
