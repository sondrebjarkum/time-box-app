import { notificationService, NotificationVariants } from "@hope-ui/solid";
import { Component } from "solid-js";

interface Interface {
    title: string,
    description: string,
    status?: NotificationVariants["status"]
}

export const showNotification = (props : Interface) => {
    notificationService.show({
        title: props.title,
        description: props.description,
        status: props.status
    })
}