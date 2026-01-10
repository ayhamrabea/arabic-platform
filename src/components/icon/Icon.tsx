import { FC } from "react";

interface IconProps {
    name: string;
    className?: string; 
}

const Icon: FC<IconProps> = ({ name, className }) => (
    <svg className={className} width="24" height="24" aria-hidden="true">
        <use href={`/sprite.svg#icon-${name}`} />
    </svg>
);

export default Icon;