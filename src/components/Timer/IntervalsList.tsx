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
    Input,
    VStack,
    IconButton
} from "@hope-ui/solid"
// import { timeItems, setTimeItems, currentTimeItem, countdownStarted } from '../../App';
import { parseTime } from '../Services/timer.service';
import { TransitionGroup } from 'solid-transition-group';
import { ITimeItem } from './ITimeItem';
import { useTimer } from './TimeItemsProvider';
import { countdownStarted, currentTimeItem, isPaused } from '../../App';
import { FiArrowDown, FiArrowUp, FiEdit, FiMoreVertical } from 'solid-icons/fi';
import { showNotification } from '../Services/notification.service';
import { createStore } from 'solid-js/store';
import { storage } from '../Services/storage.service';


const IntervalsList: Component<{ currentTime: number }> = (props) => {
    const { isOpen, onOpen, onClose } = createDisclosure()

    const [time, { getTotalTime, reArrange, edit, remove }]: any = useTimer();

    const isCurrentTimedRow = (id: string) =>
        (id === time[currentTimeItem()]?.id) ?
            countdownStarted() ? gradient() : isPaused() ? "$neutral5" : "$default" : "$default"

    const [intervalForEdit, setIntervalForEdit] = createStore<ITimeItem>({ id: "", time: 0, label: "" })

    const openEditTimeItemModal = (id: string) => {
        const item = time.find((x: ITimeItem) => x.id == id)
        const obj = {id: item.id, label: item.label, time: item.time}
        setIntervalForEdit(e => obj)
        onOpen()
    }

    const shiftItem = (id: string, direction: "up" | "down") => {
        reArrange(id, direction)
    }

    const saveInterval = () => {
        try{
            edit(intervalForEdit)
        }catch(e){
            showNotification({
                title: "Failure",
                description: "Saving interval failed",
                status : "danger"
            })
            return
        }
        showNotification({
            title: "Success",
            description: "Edits to interval saved!",
            status: "success"
        })
        storage.write( "timerItems", storage.parse(time) as string )
        onClose()
    }

    const deleteInterval = () => {
        try{
            remove(intervalForEdit.id)
        }catch(e){
            showNotification({
                title: "failure",
                description: "Deleting interval failed",
                status : "danger"
            })
            return
        }
        showNotification({
            title: "Success",
            description: "Interval deleted",
            status: "success"
        })
        storage.write( "timerItems", storage.parse(time) as string )
        onClose()
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
            <Table >
                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                <Thead>
                    <Tr>
                        <Th>Label</Th>
                        <Th numeric>Time</Th>
                        <Th w={112}></Th>

                    </Tr>
                </Thead>
                <Tbody>
                    <For each={time}>
                        {
                            (timeItem: ITimeItem) => {
                                return (
                                    <Tr

                                        // bg={isCurrentTimedRow(timeItem.id as string)}
                                        pos={"relative"}
                                    >
                                        <Td>{timeItem.label}</Td>
                                        <Td numeric>{parseTime(timeItem.time)}</Td>

                                        <Td numeric ml={"100%"}>
                                            <HStack>
                                                <VStack>
                                                    <IconButton
                                                size={"xs"}

                                                        disabled={countdownStarted()}
                                                        onClick={() => shiftItem(timeItem.id as string, "up")}
                                                        variant="ghost"
                                                        aria-label="up"
                                                        colorScheme="accent" icon={<FiArrowUp />}>
                                                    </IconButton>
                                                    <IconButton
                                                size={"xs"}

                                                        disabled={countdownStarted()}
                                                        onClick={() => shiftItem(timeItem.id as string, "down")}
                                                        variant="ghost"
                                                        aria-label="down"
                                                        colorScheme="accent" icon={<FiArrowDown />}>
                                                    </IconButton>

                                                </VStack>
                                                <IconButton
                                                    disabled={countdownStarted()}
                                                    onClick={() => openEditTimeItemModal(timeItem.id as string)}
                                                    variant="ghost"
                                                    aria-label="edit"
                                                    colorScheme="accent" icon={<FiEdit />}>
                                                </IconButton>
                                            </HStack>
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
                <Tfoot>
                    <Tr>
                        <Th></Th>
                        <Th numeric>
                            Total: {getTotalTime}
                        </Th>
                    </Tr>
                </Tfoot>
            </Table>

            <Modal opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Edit Interval</ModalHeader>
                    <ModalBody>
                        <FormControl id="label" mb="$4">
                            <FormLabel>Label</FormLabel>
                            <Input placeholder="Label" value={intervalForEdit.label} onChange={(e : any) => setIntervalForEdit("label", e.target.value)} />
                        </FormControl>
                        <FormControl id="minutes">
                            <FormLabel>Minutes</FormLabel>
                            <Input placeholder="Minutes" value={intervalForEdit.time / 60} onChange={(e : any) => setIntervalForEdit("time", e.target.value * 60)} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap={"$4"}>
                        <Button colorScheme={"danger"} variant="ghost" onClick={() => {deleteInterval(); onClose}}>Delete</Button>
                        <Button onClick={() => {saveInterval(); onClose}}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default IntervalsList;