
export interface State{
    code: string,
    name: string,
}

export default interface Country{
    name: string,
    code: string,
    states: State[] | null   
}