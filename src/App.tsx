import { Component, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { createStore } from "solid-js/store";
import { Button, Center, Container, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, InputGroup, InputRightAddon, Stack } from '@hope-ui/solid';
import IntervalsList from './components/Timer/IntervalsList';
import { ITimeItem, ITimeItems } from './components/Timer/ITimeItem';
import ModalManager, { onClose, onOpen } from './components/ModalManager/ModalManager';
import { createUUID } from './components/Services/uuid.service';
import { parseMinutes, parseTime, playAlarm as playAlert } from './components/Services/timer.service';
import { useTimer } from './components/Timer/TimeItemsProvider';
import SidebarMenu, { openSidebarMenu } from './components/Menubar/Menu';
import { FiSettings } from 'solid-icons/fi'
import { Text } from "@hope-ui/solid"
import { storage } from './components/Services/files.service';

// export const [timeItems, setTimeItems] = createStore<ITimeItem[]>([])
export const [countdownStarted, setCountdownStarted] = createSignal<boolean>(false)//TODO hent verdi fra localstorage
export const [currentTimeItem, setCurrentTimeItem] = createSignal<number>(-1);
// const [countdownPaused, setCountdownPaused] = createSignal<boolean>(false)
export const isPaused = () => (!countdownStarted() && currentTimeItem() !== -1 )


const App: Component = () => {

  const [minutesValue, setMinutesValue] = createSignal<number | undefined>(undefined)
  const [labelValue, setLabelValue] = createSignal<string>("")
  const [isValid, setIsValid] = createSignal<boolean>()
  const handleInputM = (event: any) => setMinutesValue(event.target.value);
  const handleInputL = (event: any) => setLabelValue(event.target.value);
  const [countdownTime, setCountdownTime] = createSignal<number>(0);

  const clearTimers = () => {
    clear()
    setCurrentTimeItem(e => 0)
    setCountdownTime( e => 0)
  }
  const currentTimeString = createMemo(() => {
    return parseTime(countdownTime());
  });

  const startTimer = () => {
    if(currentTimeItem() < 0) toggleCurrentTimerItemState()
    setCountdownTime(e => e = time[currentTimeItem()].time)
  }

  const toggleCurrentTimerItemState = () => setCurrentTimeItem( e => e < 0 ? 0 : -1 )

  const interval = setInterval(() => {
    if (countdownStarted()) setCountdownTime(e => e - 10) //TODO -1

    if (countdownTime() === 0 && countdownStarted()) {
      clearTimer()
    }
  }, 1000)

  onCleanup(() => clearInterval(interval));

  const clearTimer = (() => {
    onCleanup
    trudgeTimeItems()

    if (countdownStarted()) {
      if(currentTimeItem() !== 0 && storage.get("alertOn") === "yes") playAlert( storage.get("alert") + ".mp3" )
      startTimer()
    }
  })

  const toggleTimer = () => {
    setCountdownStarted(e => !e)
    if (countdownStarted() && countdownTime() < 1) startTimer()
  }

  const trudgeTimeItems = () => {
    //TODO sjekk om ikke flere items, mao sjekk om timeItems har en next
    // if (currentTimeItem() === timeItems.length - 1) {
    if (currentTimeItem() === time.length - 1) {
      setCountdownStarted(e => !e)
      // setCurrentTimeItem(e => 0)
      toggleCurrentTimerItemState()
      return
    }
    setCurrentTimeItem(e => e + 1)
  }


  createEffect(() => {
    if (minutesValue() == undefined || minutesValue() == 0) {
      setIsValid(e => false)
      return
    }
    setIsValid(e => minutesValue() as number > 0 && labelValue().length > 0)
  })

  const addTimeItem = () => {
    // setTimeItems(
    //   [...timeItems, {
    //     id: createUUID(),
    //     time: minutesValue() as number * 60,
    //     label: labelValue(),
    //     alert: false
    //   }])
    add(
      {
        id: createUUID(),
        time: minutesValue() as number,
        label: labelValue(),
        alert: false
      }
    )
    setLabelValue(e => "")
  }

  const stopCountdown = () => {
    toggleTimer()
    onCleanup
    setCountdownTime( e => 0)
    toggleCurrentTimerItemState()
  }

  const [time, { add, remove, clear }]: any = useTimer();
  return (
    <>
      <SidebarMenu/>

      <Flex  m={0} w={"100%"} justifyContent={"center"}>
        <Flex bg={"$blackAlpha7"} p={"$4"} w={"100%"} justifyContent={"space-between"}>
          <Center>
            <Text>TimeBoxr</Text>
          </Center>
          <IconButton aria-label="Settings" icon={<FiSettings />} onClick={() => openSidebarMenu()}/>
        </Flex>
      </Flex>

      <Container maxW={1000}>
        <Center>
          <Heading size="9xl">{currentTimeString()}</Heading>
        </Center>

        <HStack spacing={"$4"}>
          <Button disabled={time.length === 0} onClick={() => toggleTimer()}>{countdownStarted() ? "Pause" : "Start"}</Button>
          <Button disabled={time.length === 0} onClick={() => clearTimers()}>Clear</Button>
          <Button disabled={time.length === 0} onClick={() => stopCountdown()}>Stop</Button>
        </HStack>

        <Stack spacing={"$4"}>
          <FormControl>
            <FormLabel for="Label">Label</FormLabel>
            <Input id="Label" type="text" value={labelValue()} onInput={handleInputL} placeholder="Label" />
          </FormControl>
          <FormControl>
            <FormLabel for="Time">Time</FormLabel>
            <InputGroup>
              <Input id="Time" type="number" value={minutesValue()} onInput={handleInputM} placeholder="Minutes" />
              <InputRightAddon>min</InputRightAddon>
            </InputGroup>
          </FormControl>
          <HStack justifyContent="flex-end" alignItems="flex-end">
            <Button type="submit" onClick={() => addTimeItem()} disabled={!isValid()}>Add</Button>
          </HStack>
        </Stack>


        <IntervalsList />


      </Container>

    </>
  );
};

export default App;