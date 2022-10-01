import { Component } from 'solid-js';
import {
    Button,
    createDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@hope-ui/solid"

interface IModal {
    content?: any
}
export const { isOpen, onOpen, onClose } = createDisclosure()

const ModalManager: Component<IModal> = (props: IModal) => {

    return (
        <>
            {Modal1}
        </>
    )
}

const Modal1: Component = () => {
    return (
        <>
            <Modal opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalBody>
                        <p>Some contents...</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalManager;