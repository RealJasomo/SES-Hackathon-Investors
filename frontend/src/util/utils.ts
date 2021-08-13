export const capitalize = (value: string): string => {
    return value.split('').reduce((a, c, idx) => {
        if(idx === 0)
            return a.concat(c.toUpperCase());
        else
            return a.concat(c);
    },'');
}