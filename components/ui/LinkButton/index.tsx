import LinkButtonProps from "./props"
import { Button } from "./styled"

export const LinkButton: React.FC<LinkButtonProps> = ({ onClick, label }) => {
  return <Button onClick={onClick}>{label}</Button>
}
