import { Font } from "opentype.js";

export function convert(font : Font): any {
    let scale = (1000 * 100) / ( (font.unitsPerEm || 2048) *72);
    let result = {
        glyphs: {},
        familyName: font.names.fontFamily,
        ascender: Math.round(font.ascender * scale),
        descender: Math.round(font.descender * scale),
        underlinePosition: Math.round(font.tables.post.underlinePosition * scale),
        underlineThickness: Math.round(font.tables.post.underlineThickness * scale),
        boundingBox: {
            yMin: Math.round(font.tables.head.yMin * scale),
            xMin: Math.round(font.tables.head.xMin * scale),
            yMax: Math.round(font.tables.head.yManx * scale),
            xMax: Math.round(font.tables.head.xMax * scale),
        },
        resolution: 1000,
        original_font_information: font.tables.name,
        cssFontWeight: "normal",
        cssFontStyle: "normal"
    };

    for(let i = 0; i < font.glyphs.length; i ++) {
        let glyph = font.glyphs.get(i);
        const unicodes: number[] = [];
        if (glyph.unicode !== undefined) {
            unicodes.push(glyph.unicode);
        }
        if (glyph.unicodes.length) {
            glyph.unicodes.forEach(function(unicode){
                if (unicodes.indexOf (unicode) == -1) {
                    unicodes.push(unicode);
                }
            })
        }

        unicodes.forEach(function(unicode){
            //let glyphCharacter = String.fromCharCode(unicode);
            let token = {
                ha: 0,
                x_min: 0,
                x_max: 0,
                o: ""
            };
            token.ha = Math.round(glyph.advanceWidth! * scale);
            token.x_min = Math.round(glyph.xMin! * scale);
            token.x_max = Math.round(glyph.xMax! * scale);
            token.o = ""

            glyph.path.commands.forEach(function(command, _) {
                if (command.type.toLowerCase() === "c") {command.type = "b";}
                token.o += command.type.toLowerCase();
                token.o += " "
                if (command.x !== undefined && command.y !== undefined){
                    token.o += Math.round(command.x * scale);
                    token.o += " "
                    token.o += Math.round(command.y * scale);
                    token.o += " "
                }
                if (command.x1 !== undefined && command.y1 !== undefined){
                    token.o += Math.round(command.x1 * scale);
                    token.o += " "
                    token.o += Math.round(command.y1 * scale);
                    token.o += " "
                }
                if (command.x2 !== undefined && command.y2 !== undefined){
                    token.o += Math.round(command.x2 * scale);
                    token.o += " "
                    token.o += Math.round(command.y2 * scale);
                    token.o += " "
                }
            });
            result.glyphs[String.fromCharCode(unicode)] = token;
        });
    }
    return result
}
