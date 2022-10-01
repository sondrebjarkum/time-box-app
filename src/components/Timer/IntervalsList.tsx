import { Component, createEffect, For } from 'solid-js';
import {
    Table,
    TableCaption,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Button,
    Box
} from "@hope-ui/solid"
// import { timeItems, setTimeItems, currentTimeItem, countdownStarted } from '../../App';
import { parseTime } from '../Services/timer.service';
import { TransitionGroup } from 'solid-transition-group';
import { ITimeItem } from './ITimeItem';
import { useTimer } from './TimeItemsProvider';
import { countdownStarted, currentTimeItem, isPaused } from '../../App';

const IntervalsList: Component<{ timeItems ?: ITimeItem[] }> = (props) => {

    const [time]: any = useTimer();

    const iscurrentTimedRow = (id : string) =>
        (id === time[currentTimeItem()]?.id) ? 
            countdownStarted() ? "$primary9" : isPaused() ? "$neutral5" : "$default" : "$default"

        // (id === time[currentTimeItem()]?.id && countdownStarted()) 
        // ? "$primary9"
        //     : isPaused()
        //     ? "$neutral5"
        // : "$default"

    const openModal = () => {
        console.log("open!")
    }

    return (
        <Box>

            <Table highlightOnHover>
                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                <Thead>
                    <Tr>
                        <Th>Label</Th>
                        <Th numeric>Time</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <For each={time}>
                        {
                            (timeItem : ITimeItem) => {
                                return (
                                    <Tr
                                        onClick={() => openModal()}
                                    // bgColor={(timeItem.id === timeItems[currentTimeItem()].id && countdownStarted()) ? "$primary9" : "$default"}
                                    bgColor={iscurrentTimedRow(timeItem.id as string)}

                                    >
                                        <Td>{timeItem.label}</Td>
                                        <Td numeric>{parseTime(timeItem.time)}</Td>
                                    </Tr>
                                )
                            }
                        }
                    </For>
                </Tbody>
                {/* <Tfoot>
                    <Tr>
                        <Th>
                            <Button onClick={() => addItem()} >add</Button>
                        </Th>
                    </Tr>
                </Tfoot> */}
            </Table>
        </Box>
    )
}

export default IntervalsList;