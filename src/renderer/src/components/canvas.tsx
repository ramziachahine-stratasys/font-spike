import * as threeFiber from "@react-three/fiber"
import { Center, OrbitControls, Text3D } from "@react-three/drei"
import React from "react";
import { Font } from "three/examples/jsm/loaders/FontLoader";


export const Canvas = React.memo((props: { font: Font }) : JSX.Element => {
    console.log(props.font);

    return <threeFiber.Canvas>
        <OrbitControls enablePan={false}/>
        <color attach="background" args={['#171720']}/>
        { props.font &&
            <Center>
                <mesh position={[0, 0, 0]}>
                    <Text3D font = { props.font.data }>
                        { props.font.data?.familyName?.en }
                        <meshBasicMaterial color={'white'}/>
                    </Text3D>
                </mesh>
            </Center>
        }
    </threeFiber.Canvas>
})

