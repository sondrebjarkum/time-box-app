import { Component, createEffect, createSignal, For, on } from 'solid-js';
import {
    Text,
    Button,
    createDisclosure,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Select,
    SelectContent,
    SelectIcon,
    SelectListbox,
    SelectOption,
    SelectOptionIndicator,
    SelectOptionText,
    SelectPlaceholder,
    SelectTrigger,
    SelectValue,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    VStack,
    SelectOptGroup,
    SelectLabel,
} from "@hope-ui/solid"
import { IAlarmProperties, listAlarmFileNames, listAlarmFileNamesMeme, listAlarmFileNamesReg, playAlert } from '../Services/timer.service';
import { showNotification } from '../Services/notification.service';
import { storage } from '../Services/storage.service';
import CCheckbox from '../Custom/CCheckbox';

const { isOpen, onOpen, onClose } = createDisclosure()
export const openSidebarMenu = onOpen

const SidebarMenu: Component = () => {
    const [selectedAlert, setSelectedAlert] = createSignal(storage.get("alert") || "default")
    const [selectedAlertAhead, setSelectedAlertAhead] = createSignal(storage.get("alertAhead") || "default")
    const [toggleAlert, setToggleAlert] = createSignal<boolean>(storage.get("alertOn") === "y")
    const [alertTiming, setAlertTiming] = createSignal<number>(parseInt(storage.get("alertTiming")) || 0)
    const [alertVolume, setAlertVolume] = createSignal<IAlarmProperties["volume"]>(storage.get("alertVolume") as IAlarmProperties["volume"] || "100")


    const setSelectedAlarmHandler = (alarm: any) => {
        setSelectedAlert(e => alarm)
        playAlert(alarm + ".mp3")
        return alarm
    }
    const setSelectedAlarmAheadHandler = (alarm: any) => {
        setSelectedAlertAhead(e => alarm)
        playAlert(alarm + ".mp3")
        return alarm
    }
    const setAlertVolumeHandler = (alarm: any) => {
        setAlertVolume(e => alarm)
        playAlert(selectedAlert() + ".mp3", { volume: alertVolume() })
        return alarm
    }
    const clearStorage = () => {
        storage.clear()
        showNotification(
            {
                title: "Storage cleared",
                description: "Everything is cleared!",
                status: "success"
            }
        )
    }
    const saveSettings = () => {
        try {
            storage.write("alert", selectedAlert())
            storage.write("alertOn", toggleAlert() ? "y" : "n")
            storage.write("alertTiming", String(alertTiming()))
            storage.write("alertVolume", alertVolume())
            storage.write("alertAhead", selectedAlertAhead())

        } catch (e) {
            showNotification({ title: "Failed to save", description: "Failed to save settings... 😓", status: "danger" })
        }
        showNotification({ title: "Success", description: "Settings saved! 🤠", status: "success" })
        onClose()
    }

    return (
        <>
            <Drawer
                opened={isOpen()}
                placement="right"
                onClose={onClose}
                size={"md"}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Settings</DrawerHeader>

                    <DrawerBody>
                        <Tabs>
                            <TabList>
                                <Tab>Alerts</Tab>
                                <Tab>Storage</Tab>
                                {/* <Tab>????</Tab> */}
                            </TabList>
                            <TabPanel>
                                {/* ALERTS */}

                                <VStack alignItems={"stretch"} gap={"$6"}>

                                    {/* Toggle alert */}
                                    <CCheckbox
                                        name="Toggle alert"
                                        description='Whether to play a soundclip when timer is trudged'
                                        callback={(e: boolean) => setToggleAlert(a => e)}
                                        initValue={toggleAlert()}
                                    />

                                    <Divider />

                                    {/* Alert sound */}
                                    <FormControl>
                                        <FormLabel for="alert">Alert sound</FormLabel>
                                        <Select defaultValue="Solid" value={selectedAlert()} onChange={setSelectedAlarmHandler}>
                                            <SelectTrigger>
                                                <SelectPlaceholder>Choose alarm sound</SelectPlaceholder>
                                                <SelectValue />
                                                <SelectIcon />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectListbox>
                                                    <SelectOptGroup>
                                                        <SelectLabel>Regular</SelectLabel>
                                                        <For each={listAlarmFileNamesReg}>
                                                            {item => (
                                                                <SelectOption value={item} >
                                                                    <SelectOptionText >{item}</SelectOptionText>
                                                                    <SelectOptionIndicator />
                                                                </SelectOption>
                                                            )}
                                                        </For>
                                                    </SelectOptGroup>
                                                    <SelectOptGroup>
                                                        <SelectLabel>Memes</SelectLabel>
                                                        <For each={listAlarmFileNamesMeme}>
                                                            {item => (
                                                                <SelectOption value={item} >
                                                                    <SelectOptionText >{item}</SelectOptionText>
                                                                    <SelectOptionIndicator />
                                                                </SelectOption>
                                                            )}
                                                        </For>
                                                    </SelectOptGroup>
                                                </SelectListbox>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    {/* Alert volume */}
                                    <FormControl>
                                        <VStack alignItems={"stretch"}>
                                            <FormLabel for="alertbefore">Alert volume</FormLabel>
                                            <Select defaultValue="25" value={alertVolume()} onChange={setAlertVolumeHandler}>
                                                <SelectTrigger>
                                                    <SelectPlaceholder>Choose volume</SelectPlaceholder>
                                                    <SelectValue />
                                                    <SelectIcon />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectListbox>
                                                        <For each={["25", "50", "75", "100"]}>
                                                            {item => (
                                                                <SelectOption value={item} >
                                                                    <SelectOptionText >{item}%</SelectOptionText>
                                                                    <SelectOptionIndicator />
                                                                </SelectOption>
                                                            )}
                                                        </For>
                                                    </SelectListbox>
                                                </SelectContent>
                                            </Select>
                                        </VStack>
                                    </FormControl>

                                    <Divider />

                                    {/* Toggle alert x-seconds before */}
                                    <FormControl>
                                        <VStack alignItems={"stretch"}>
                                            <FormLabel for="alertbefore">Alert me ahead of time!</FormLabel>
                                            <HStack gap={"$4"} >
                                                <Text>off</Text>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="59"
                                                    value={alertTiming()}
                                                    onChange={(e: any) => setAlertTiming(a => e.target.value)}
                                                    class="slider"
                                                    style={{ width: "100%" }}
                                                />
                                                <Text>59s</Text>
                                            </HStack>
                                        </VStack>
                                        <FormHelperText>How many seconds before the next interval an alert should play</FormHelperText>
                                    </FormControl>

                                    {/* Alert ahead sound */}
                                    <FormControl>
                                        <FormLabel for="alert">Alert ahead sound</FormLabel>
                                        <Select defaultValue="Solid" value={selectedAlertAhead()} onChange={setSelectedAlarmAheadHandler}>
                                            <SelectTrigger>
                                                <SelectPlaceholder>Choose alarm sound</SelectPlaceholder>
                                                <SelectValue />
                                                <SelectIcon />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectListbox>
                                                    <For each={listAlarmFileNames}>
                                                        {item => (
                                                            <SelectOption value={item} >
                                                                <SelectOptionText >{item}</SelectOptionText>
                                                                <SelectOptionIndicator />
                                                            </SelectOption>
                                                        )}
                                                    </For>
                                                </SelectListbox>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <Divider />


                                </VStack>

                            </TabPanel>

                            {/* Storage */}
                            <TabPanel >
                                <VStack alignItems={"flex-start"} spacing="$4">
                                    <Button colorScheme={"success"} onClick={() => null}>Force save current timers</Button>
                                    <Button colorScheme={"danger"} onClick={() => clearStorage()}>Clear Storage</Button>
                                </VStack>
                            </TabPanel>


                            {/* <TabPanel>
                                <p>Oh, hello there.</p>
                            </TabPanel> */}


                        </Tabs>


                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr="$3" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => saveSettings()}>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )


}

export default SidebarMenu;