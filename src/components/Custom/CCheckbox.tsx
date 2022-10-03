import { Center, CheckboxGroup, CheckboxPrimitive, CheckboxPrimitiveIndicator, css, HStack, VStack } from "@hope-ui/solid";
import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import { Text } from "@hope-ui/solid"
import { FiCheck } from 'solid-icons/fi'
import { storage } from "../Services/storage.service";
import { setInterval } from "timers/promises";

interface Interface {
    name: string,
    description: string,
    callback : (value : any) => boolean,
    initValue : boolean
}

const checkboxRootStyles = css({
    rounded: "$md",
    border: "1px solid $neutral7",
    shadow: "$sm",
    bg: "$loContrast",
    px: "$4",
    py: "$3",
    w: "$full",
    cursor: "pointer",

    _focus: {
        borderColor: "$info7",
        shadow: "0 0 0 3px $colors$info5",
    },

    _checked: {
        borderColor: "transparent",
        bg: "#0c4a6e",
        color: "white",
    },
    "data-checked" : {
        borderColor: "transparent",
        bg: "#0c4a6e",
        color: "white",
    }
});

const checkboxIndicatorStyles = css({
    rounded: "$sm",
    border: "1px solid $neutral7",
    bg: "$whiteAlpha7",
    boxSize: "$5",

    _groupChecked: {
        borderColor: "transparent",
    },
});

export default function CCheckbox(props : Interface) {

    const [internalState, setInternalState] = createSignal<boolean>(props.initValue)
    const toggleStateHandler = ( e : any) => {
        setInternalState(a => !a)
        props.callback(e.target.checked as boolean)
    }

    return (
            <VStack spacing="$4">
                <CheckboxPrimitive
                    checked={internalState()}
                    defaultChecked={internalState()}
                    onChange={e => toggleStateHandler(e)}
                    value={1}
                    class={checkboxRootStyles()}
                >
                    <HStack justifyContent="space-between" w="$full">
                        <VStack alignItems="flex-start">
                            <Text size="sm" fontWeight="$semibold">
                                {props.name}
                            </Text>
                            <Text
                                size="sm"
                                color="$neutral11"
                                _groupChecked={{
                                    color: "$whiteAlpha12",
                                }}
                            >
                                {props.description}
                            </Text>
                        </VStack>
                        <Center class={checkboxIndicatorStyles()}>
                            <CheckboxPrimitiveIndicator>
                                <FiCheck display="block" />
                            </CheckboxPrimitiveIndicator>
                        </Center>
                    </HStack>
                </CheckboxPrimitive>
            </VStack>
    )
};
