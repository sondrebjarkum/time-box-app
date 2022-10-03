import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createUUID } from "../Services/uuid.service";
import { ITimeItem } from "./ITimeItem";

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
                remove(id : string) {
                    const newItems = time.filter( e => e.id !== id)
                    setTime( e => newItems)
                },
                clear() {
                    setTime(() => [])
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