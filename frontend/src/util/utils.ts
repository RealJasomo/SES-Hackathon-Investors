export const capitalize = (value: string | undefined): string | undefined => {
    if (value) {
        return value.split('').reduce((a, c, idx) => {
            if(idx === 0)
                return a.concat(c.toUpperCase());
            else
                return a.concat(c);
        },'');
        }   
    return value;
}