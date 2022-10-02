import { storage } from "./files.service";

export const timer = () => null

export const parseMinutes = (minutes : number) => {
    return minutes
}

export const parseTime = (SECONDS : any) => new Date(SECONDS * 1000).toISOString().substr(11, 8);

export const playAlert = (file: string, properties ?: IProperties) => {
    const audio = new Audio("./alarms/"+file)
    const volume = parseInt(storage.get("alertVolume"), 10) / 100 || parseInt(properties?.volume as string) / 100 || 1
    audio.volume = volume
    audio.play()
}

export const listAlarmFileNames = ["default","clicks", "dark", "shrek", "onions", "arnold", "airhorn", "bruh", "msn", "phil"]
export interface IProperties{
    volume : "25" | "50"| "75"| "100"
}
// const volumeValues = "25" | "50"| "75"| "100"