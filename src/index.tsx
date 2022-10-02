/* @refresh reload */
import { render } from 'solid-js/web';
import { HopeProvider, HopeThemeConfig, NotificationsProvider } from '@hope-ui/solid'

import './index.css';
import App from './App';
import { TimerProvider } from './components/Timer/TimeItemsProvider';

const config: HopeThemeConfig = {
    initialColorMode: "dark",
}

render(() => <TimerProvider >
                <HopeProvider config={config}>
                    <NotificationsProvider placement="bottom-start">
                        <App />
                    </NotificationsProvider>
                </HopeProvider>
            </TimerProvider>, document.getElementById('root') as HTMLElement);
