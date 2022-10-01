export const timer = () => null

export const parseMinutes = (minutes : number) => {
    return minutes
}

export const parseTime = (SECONDS : any) => new Date(SECONDS * 1000).toISOString().substr(11, 8);
