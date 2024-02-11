import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron/renderer'

type TArgs = { [key: string]: any };
export type TApi = {
    send: (channel: string, data: TArgs) => void,
    receive: (
        channel: string, 
        func: (args: TArgs) => any
    ) => void,
}

// Custom APIs for renderer
const api: TApi = {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);    
    },
    receive: async (channel, func) => {
        ipcRenderer.on(channel, (_, args) => func(args));
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
