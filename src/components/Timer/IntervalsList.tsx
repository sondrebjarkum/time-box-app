import { Component, createEffect, createSignal, For, Show } from 'solid-js';
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
    Box,
    css,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    createDisclosure,
    FormControl,
    FormLabel,
    Input
} from "@hope-ui/solid"
// import { timeItems, setTimeItems, currentTimeItem, countdownStarted } from '../../App';
import { parseTime } from '../Services/timer.service';
import { TransitionGroup } from 'solid-transition-group';
import { ITimeItem } from './ITimeItem';
import { useTimer } from './TimeItemsProvider';
import { countdownStarted, currentTimeItem, isPaused } from '../../App';
import { FiMoreVertical } from 'solid-icons/fi';


const IntervalsList: Component<{ currentTime: number }> = (props) => {
    const { isOpen, onOpen, onClose } = createDisclosure()

    const [time]: any = useTimer();

    const isCurrentTimedRow = (id: string) =>
        (id === time[currentTimeItem()]?.id) ?
            countdownStarted() ? gradient() : isPaused() ? "$neutral5" : "$default" : "$default"

    const [intervalForEdit, setIntervalForEdit] = createSignal<ITimeItem>({id: "", time: 1, label: "" })
    
    const openEditTimeItemModal = (id: string) => {
        setIntervalForEdit(e => time.find( (x : ITimeItem) => x.id == id))
        onOpen()
    }


    const bgShifter = css({
        content: "",
        pos: "absolute",
        left: 0,
        h: "100%",
        // h: 100,
        pointerEvents: "none",
        bg: "$primary9",
        filter: "opacity(20%)",
        transition: "all 1s linear"
    });
    const gradient = () => `linear-gradient(90deg, rgba(2,0,36,1) ${props.currentTime / time[currentTimeItem()]?.time * 100}%, rgba(0,212,255,0) ${props.currentTime / time[currentTimeItem()]?.time * 100}%)`


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
                            (timeItem: ITimeItem) => {
                                return (
                                    <Tr
                                        onClick={() => openEditTimeItemModal(timeItem.id as string)}
                                        // bg={isCurrentTimedRow(timeItem.id as string)}
                                        pos={"relative"}
                                    >
                                        <Td>{timeItem.label}</Td>
                                        <Td numeric>
                                            {parseTime(timeItem.time)}
                                        </Td>
                                        <Show when={(timeItem.id === time[currentTimeItem()]?.id)}>
                                            <Box
                                                class={bgShifter()}
                                                w={props.currentTime / time[currentTimeItem()]?.time * 100 + "%"}
                                            />
                                        </Show>



                                        {/* <Box  class={bgShifter()}></Box> */}
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

            <Modal opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Edit Interval</ModalHeader>
                    <ModalBody>
                        <FormControl id="label" mb="$4">
                            <FormLabel>Label</FormLabel>
                            <Input placeholder="Label" value={intervalForEdit().label} />
                        </FormControl>
                        <FormControl id="minutes">
                            <FormLabel>Minutes</FormLabel>
                            <Input placeholder="Minutes" value={intervalForEdit().time}/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default IntervalsList;