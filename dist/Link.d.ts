import { ReactNode } from "react";
interface IProps {
    children: ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
}
/**
 * @name Link
 */
declare function Link(props: IProps): JSX.Element;
export { Link };
