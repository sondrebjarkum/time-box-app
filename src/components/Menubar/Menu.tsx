import { Component, createEffect, createSignal, For, on } from 'solid-js';
import {
    Button,
    createDisclosure,
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
    IconButton,
    Input,
    notificationService,
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
    Switch,
    VStack,
} from "@hope-ui/solid"
import { listAlarmFileNames, playAlarm } from '../Services/timer.service';
import { showNotification } from '../Services/notification.service';
import { storage } from '../Services/files.service';
import CCheckbox from '../Custom/CCheckbox';

const { isOpen, onOpen, onClose } = createDisclosure()
export const openSidebarMenu = onOpen

const SidebarMenu: Component = () => {
    const [selectedAlert, setSelectedAlert] = createSignal(storage.get("alert") || "default")
    const [toggleAlert, setToggleAlert] = createSignal<boolean>(storage.get("alertOn") === "y")

    const setSelectedAlarmHandler = (alarm: any) => {
        setSelectedAlert(e => alarm)
        playAlarm(alarm + ".mp3")
        return alarm
    }

    const saveSettings = () => {
        try {
            storage.write("alert", selectedAlert())
            storage.write("alertOn", toggleAlert() ? "y" : "n")

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

                            <CCheckbox 
                                name="Toggle alert" 
                                description='Whether to play a soundclip when timer is trudged'
                                callback={(e : boolean) => setToggleAlert(a => e)}
                                initValue={toggleAlert()}
                            />

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
                            <FormHelperText>What sound to play when timer runs out.</FormHelperText>
                        </FormControl>



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