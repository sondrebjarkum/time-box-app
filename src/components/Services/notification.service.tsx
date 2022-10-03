import { Button, HStack, notificationService, NotificationVariants } from "@hope-ui/solid";
import { Component } from "solid-js";

interface Interface {
    title: string,
    description: string,
    status?: NotificationVariants["status"],
    persist?: boolean,
    render?: any,
    action ?: () => void
}

export const showNotification = (props: Interface) => {
    notificationService.show({
        title: props.title,
        description: props.description,
        status: props.status,
        persistent: props.persist
    })
}

export const showCustomNotification = (props: Interface) => {
    notificationService.show({
        title: props.title,
        description: props.description,
        status: props.status,
        persistent: props.persist,
        render: pr => (
            <HStack
                bg="$loContrast"
                rounded="$md"
                border="1px solid $neutral7"
                shadow="$lg"
                p="$4"
                w="$full"
            >
                {props.render}

                <HStack ml={"auto"}>
                    <Button
                        variant="ghost"
                        colorScheme="neutral"
                        size="sm"
                        ml="auto"
                        onClick={() => pr.close()}
                    >
                        No
                    </Button>
                    <Button
                        variant="ghost"
                        colorScheme="accent"
                        size="sm"
                        ml="auto"
                        onClick={() => { props.action && props.action(); pr.close()}}
                    >
                        Yes
                    </Button>
                </HStack>
                
            </ HStack>
        ),
    })
}