import { useEffect, useState } from "react";
import React from "react";

export const Selector = React.memo((props: {
    fontPath: string,
    fontName: string,
    setFontName: (fontName: string) => void
}): JSX.Element => {
    const [installedFonts, setInstalledFonts] = useState<string[]>([]);

    async function getFiles() {
        window.api.send("allFonts", { path: props.fontPath });
        const files = await new Promise((resolve, reject) => {
            window.api.receive("dirData", (payload) => {
                if(payload) {
                    resolve(payload.files);
                } else {
                    reject();
                }
            });
        });
        setInstalledFonts(files as string[]);
    }
    useEffect(() => {
        getFiles();
    }, [])

    return <select 
        value={props.fontName}
        onChange={(e) => {
            console.log(e.currentTarget.value);
            props.setFontName(e.currentTarget.value);
        }}
    >
        {installedFonts.map((font, index) => {
            return <option 
                key={index} 
                value={font}
                selected={font === props.fontName}
            >
                {font}
            </option>
        })}
    </select>
})
