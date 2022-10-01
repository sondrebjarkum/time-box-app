import { Component, createSignal } from 'solid-js';
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
    Input,
} from "@hope-ui/solid"

const { isOpen, onOpen, onClose } = createDisclosure()
export const openSidebarMenu = onOpen

const SidebarMenu: Component = () => {


    return (
        <>
            <Drawer
                opened={isOpen()}
                placement="right"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder="Type here..." />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr="$3" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SidebarMenu;