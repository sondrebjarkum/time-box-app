
export const timer = () => null

export const parseMinutes = (minutes : number) => {
    return minutes
}

export const parseTime = (SECONDS : any) => new Date(SECONDS * 1000).toISOString().substr(11, 8);

export const playAlarm = (file: string) => {
    new Audio("./alarms/"+file).play()
}

export const listAlarmFileNames = ["default","clicks", "dark", "shrek", "onions", "arnold", "airhorn", "bruh", "msn", "phil"]