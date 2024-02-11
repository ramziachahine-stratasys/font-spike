import { useCallback, useEffect, useState } from 'react';
import { Canvas } from './components/canvas';
import { Selector } from './components/selector';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as otjs from 'opentype.js';
import { convert } from './utils/font_conversion';

function App(): JSX.Element {
    // MacOS
    const defaultFontPath = "/System/Library/Fonts/Supplemental/";
    
    // Windows
    // const defaultFontPath = "C:\Windows\Fonts"

    const fontLoader = new FontLoader();
    const [loadedFonts, setLoadedFonts] = useState<{[fontPath: string]: Font}>({})
    const [fontName, setFontName] = useState<string>("Arial.ttf");
 
    const changeFont = useCallback((fontName: string) => setFontName(fontName), [])
    
    const loadFont = async (fontName: string) => {
        if(loadedFonts[defaultFontPath + fontName]) {
            return;
        }
        window.api.send("readFile", { fontPath: defaultFontPath + fontName });
    
        const arr = await new Promise((resolve, reject) => 
            window.api.receive("fileData", (payload) => {
                if(payload) {
                    return resolve(payload.file)
                } else {
                    return reject();
                }
            })
        ) as Uint8Array;
        
        if (!arr) {
            return;
        }

        const fontFile = arr.buffer.slice(arr.byteOffset, arr.byteLength + arr.byteOffset);
        if(!fontFile) {
            return;
        }
        const fontObj = fontLoader.parse(convert(otjs.parse(fontFile)));
        setLoadedFonts({...loadedFonts, [`${defaultFontPath}${fontName}`]: fontObj});
    };
    
    useEffect(() => {
        loadFont(fontName);
    }, [fontName]);

    return (
        <div style={{width: "100%", height: "100%"}}>
            <Canvas font = { loadedFonts[defaultFontPath + fontName] }/>
            <div className='control-panel'>
            <Selector fontPath={defaultFontPath} fontName={fontName} setFontName={changeFont}/>
            </div>
        </div>
    )
}

export default App
