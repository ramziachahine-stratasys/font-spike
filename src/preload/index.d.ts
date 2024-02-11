import { ElectronAPI } from '@electron-toolkit/preload'
import { TApi } from './index'

declare global {
    interface Window {
        electron: ElectronAPI
        api: TApi
    }
}
