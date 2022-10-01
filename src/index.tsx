/* @refresh reload */
import { render } from 'solid-js/web';
import { HopeProvider, HopeThemeConfig } from '@hope-ui/solid'

import './index.css';
import App from './App';
import { TimerProvider } from './components/Timer/TimeItemsProvider';

const config: HopeThemeConfig = {
    initialColorMode: "dark", 
}

render(() => <TimerProvider >
                <HopeProvider config={config}>
                    <App />
                </HopeProvider>
            </TimerProvider> , document.getElementById('root') as HTMLElement);
