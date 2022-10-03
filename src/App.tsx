
import { Component, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { createStore } from "solid-js/store";
import { Button, Center, Container, Divider, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, InputGroup, InputRightAddon, Stack, VStack } from '@hope-ui/solid';
import IntervalsList from './components/Timer/IntervalsList';
import { ITimeItem, ITimeItems } from './components/Timer/ITimeItem';
import ModalManager, { onClose, onOpen } from './components/ModalManager/ModalManager';
import { createUUID } from './components/Services/uuid.service';
import { parseTime, playAlert } from './components/Services/timer.service';
import { useTimer } from './components/Timer/TimeItemsProvider';
import SidebarMenu, { openSidebarMenu } from './components/Menubar/Menu';
import { FiPause, FiPlay, FiSettings } from 'solid-icons/fi'
import { Text } from "@hope-ui/solid"
import { storage } from './components/Services/storage.service';
import styles from './index.css'
import { ImPause2, ImPlay2, ImPlay3, ImStop, ImStop2 } from 'solid-icons/im'
import { showCustomNotification } from './components/Services/notification.service';

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
  const [countdownTime, setCountdownTime] = createSignal<number>(0); //sekunder?

  onMount(async () => {
    const res = storage.parse(storage.get("timerItems")) as Array<any>
    if(typeof(res) == "string") return
    showCustomNotification({
      title: "",
      description: "",
      persist: true,
      action: () => res.map( (e : any) => addTimeItem(e)),
      render : (
        
          <VStack alignItems="flex-start">
            <Text size="sm" fontWeight="$medium">
              Saved progress
            </Text>
            <Text size="sm" color="$neutral11">
              Load saved progress from last session?
            </Text>
          </VStack>
          
      )
    })
    
  });

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
    if (countdownStarted()) setCountdownTime(e => e - 1)

    if(countdownTime() == parseInt(storage.get("alertTiming"), 10) && countdownStarted()){
      playAlert( storage.get("alert") + ".mp3" )
    }

    if (countdownTime() === 0 && countdownStarted()) {
      clearTimer()
    }
  }, 1000)

  onCleanup(() => clearInterval(interval));

  const clearTimer = (() => {
    onCleanup
    trudgeTimeItems()

    if (countdownStarted()) {
      if(currentTimeItem() !== 0 && storage.get("alertOn") === "y"){ 
        playAlert( storage.get("alert") + ".mp3" )
      }
      startTimer()
    }
  })

  const toggleTimer = () => {
    setCountdownStarted(e => !e)
    if (countdownStarted() && countdownTime() < 1) startTimer()
  }

  const trudgeTimeItems = () => {
    if (currentTimeItem() === time.length - 1) {
      setCountdownStarted(e => !e)
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

  const addTimeItem = (item ?: ITimeItem) => {
    console.log("item", item)
    add(
      {
        id: item ? item.id : createUUID(),
        time: item ? item.time / 60 : minutesValue() as number,
        label: item ? item.label : labelValue(),
      }
    )
    setLabelValue(e => "")
    !item && storage.write( "timerItems", storage.parse(time) as string )
  }

  const stopCountdown = () => {
    setCountdownStarted(e => false)
    setCountdownTime( e => 0)
    toggleCurrentTimerItemState()
    onCleanup
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

      <Container maxW={1000} p="$4">
        <Center>
          <Heading size="9xl">{currentTimeString()}</Heading>
        </Center>

        <Divider mt="$4" mb="$4" />

        <HStack spacing={"$4"}>
          {/* <Button disabled={timeItems.length === 0} onClick={() => toggleTimer()}>{countdownStarted() ? "Stop" : "Start"}</Button>
          <Button disabled={timeItems.length === 0} onClick={() => clearTimers()}>Clear</Button> */}
          <Button colorScheme={countdownStarted() ? "warning" : "success"} disabled={time.length === 0}  onClick={() => toggleTimer()}>{countdownStarted() ? <ImPause2 size={20}/> : <ImPlay3 size={20}/>}</Button>
          <Button colorScheme={"danger"} disabled={time.length === 0 || countdownStarted()}   onClick={() => stopCountdown()}><ImStop2 size={20}/></Button>
          <Button colorScheme={"neutral"} disabled={time.length === 0 || countdownStarted()}    onClick={() => clearTimers()} ml={"auto"}>Clear</Button>
        </HStack>

        <Divider mt="$4" mb="$4" />

        <Stack spacing={"$4"}>
          <FormControl>
            <FormLabel for="Label">Label</FormLabel>
            <Input id="Label" type="text" value={labelValue()} onInput={handleInputL} placeholder="Label" />
          </FormControl>
          <FormControl>
            <FormLabel for="Time">Minutes</FormLabel>
            <InputGroup>
              <Input id="Time" type="number" value={minutesValue()} onInput={handleInputM} placeholder="Minutes" />
              <InputRightAddon>min</InputRightAddon>
            </InputGroup>
          </FormControl>
          <HStack justifyContent="flex-end" alignItems="flex-end">
            <Button type="submit" onClick={() => addTimeItem()} disabled={!isValid()}>Add</Button>
          </HStack>
        </Stack>


        <IntervalsList currentTime={countdownTime()} />


      </Container>

    </>
  );
};

export default App;