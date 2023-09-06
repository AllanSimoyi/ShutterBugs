import icon from '~/../public/images/Shutterbugs_Icon.png';
import logo from '~/../public/images/Shutterbugs_logo.png';

interface Props {
  isIcon?: boolean;
}

export function AppTitle({ isIcon }: Props) {
  if (isIcon) {
    return <img src={icon} alt="ShutterBugs" />;
  }
  return <img src={logo} alt="ShutterBugs" />;
}
