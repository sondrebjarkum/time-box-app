import { createContext, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { parseTime } from "../Services/timer.service";

/**
 * Interface for a timed interval item
 *
 * @time {number} Item time in seconds
 * @label {string} Item name to be displayed
 * @alert {boolean} Whether to play a sound when timed out
 */
export interface ITimeItem{
    id?: string,
    time: number,
    label: string,
}


const TimerContext = createContext();

export function TimerProvider(props: any) {
    const [time, setTime] = createStore<ITimeItem[]>([]),
        timer = [
            time,
            {
                add(item: ITimeItem) {
                    setTime(
                        [...time, {
                            id: item.id,
                            time: item.time as number * 60,
                            label: item.label,
                        }])
                },
                remove(id: string) {
                    const newItems = time.filter(e => e.id !== id)
                    setTime(e => newItems)
                },
                clear() {
                    setTime(() => [])
                },
                edit(item : any) {
                    console.log("item", item)
                    setTime(
                        (e) => e.id === item.id,
                        produce( (e) => (e.label = item.label, e.time = item.time) ),
                    )
                },
                getTotalTime() {
                    const sum = time.reduce((accumulator, object) => {
                        return accumulator + object.time;
                    }, 0);
                    return parseTime(sum)

                },
                reArrange(id: string, direction: "up" | "down") {
                    //TODO This is horrible....
                    const isUp = direction == "up"
                    const index = time.findIndex(e => e.id === id)
                    if ((index === 0 && isUp) || (index === time.length - 1 && !isUp)) {
                        return
                    }
                    const curritem = time[index]
                    const otheritem = isUp ? time[index - 1] : time[index + 1]
                    const otherindex = time.findIndex(e => e.id === otheritem.id)
                    let shiftedTime = time.map((e) => e)
                    shiftedTime[otherindex] = curritem
                    shiftedTime[index] = otheritem

                    setTime([...shiftedTime])

                }
            }
        ];

    return (
        <TimerContext.Provider value={timer}>
            {props.children}
        </TimerContext.Provider>
    );
}

export function useTimer() { return useContext(TimerContext); }