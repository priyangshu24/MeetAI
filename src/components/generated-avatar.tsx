import { createAvatar } from '@dicebear/core';
import { botttsNeutral, initials } from '@dicebear/collection';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant?: 'botttsNetural' | 'initials';
}

export const generateAvatarUrl = (seed: string, variant?: 'botttsNetural' | 'initials') => {
    let avatar;
    if (variant === 'botttsNetural') {
        avatar = createAvatar(botttsNeutral, {
            seed,
        })
    }
    else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
        });
    }
    return avatar.toDataUri();
};

export const GeneratedAvatar = ({
    seed,
    className,
    variant
}: GeneratedAvatarProps) => {
    const avatarUrl = generateAvatarUrl(seed, variant);

    return(
        <Avatar className={cn(className)} >
        <AvatarImage src={avatarUrl} alt="Avatar"/>
        <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    )

}